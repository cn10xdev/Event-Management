const express = require('express');
const router = express.Router();

const isAuth = require('../middleware/isAuth');
const Payment = require('../models/payment');
const User = require('../models/user');
const { errorLogger } = require('../utils/logger');

const path = require('path');
const templatesPath = path.join(__dirname, '../templates');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

router.use(isAuth);

router.get('/', async (req, res) => {
  try {
    const { page = 1, admin, user } = req.query;
    const pageLimit = 60;

    const filter = {};
    if (admin) filter.adminUsername = admin;
    if (user) filter.userRollNo = user;
    const payments = await Payment.find(
      filter,
      '-_id adminUsername userRollNo time amount'
    )
      .sort('-time')
      .limit(pageLimit)
      .skip((page - 1) * pageLimit)
      .exec();

    const maxPage = Math.ceil(
      (await Payment.estimatedDocumentCount(filter)) / pageLimit
    );

    res.send({
      data: {
        payments,
        maxPage,
      },
      error: null,
    });
  } catch (err) {
    res.status(500).send({
      data: null,
      error: 'something went wrong',
    });
    errorLogger.error(err);
  }
});

router.post('/', async (req, res) => {
  try {
    const { rollNo, amount } = req.body;
    if (amount === 0) {
      res.sendStatus(200);
      return;
    }

    await User.findOneAndUpdate(
      { rollNo },
      { $inc: { moneyOwed: -1 * amount } }
    );
    const payment = new Payment({
      userRollNo: rollNo,
      amount,
      adminUsername: req.session.username,
    });
    await payment.save();

    res.status(200).send({ data: true, error: null });
  } catch (err) {
    res.status(500).send({ data: null, error: true });
    errorLogger.log(err);
  }
});

router.get('/report', async (req, res) => {
  try {
    const payments = await Payment.find()
      .select('-_id userRollNo time amount')
      .sort('userRollNo')
      .populate({
        path: 'user',
        model: 'User',
        select: '-_id rollNo name phoneNumber email semester department',
        options: { lean: true },
      })
      .exec();
    // console.log(payments);
    const resultPath = path.resolve(templatesPath, `payments.csv`);
    const csvWriter = createCsvWriter({
      path: resultPath,
      header: [
        { id: 'rollNo', title: 'ROLLNO' },
        { id: 'name', title: 'NAME' },
        { id: 'amount', title: 'AMOUNT' },
        { id: 'time', title: 'TIME' },
        { id: 'semester', title: 'SEM' },
        { id: 'department', title: 'DEPT' },
        { id: 'phoneNumber', title: 'PHONE' },
        { id: 'email', title: 'EMAIL' },
      ],
    });

    await csvWriter.writeRecords(
      payments.map(({ amount, user, time }) => ({ amount, time, ...user }))
    );

    res.download(resultPath);
  } catch (err) {
    // console.error(err);
    res.sendStatus(500);
    errorLogger.error(err);
  }
});

module.exports = router;
