const express = require('express');
const router = express.Router();
const isAuth = require('../middleware/isAuth');
const User = require('../models/user');
const { default: validator } = require('validator');
const mailer = require('../utils/new_mailer');
const rollToDept = require('../utils/rollToDept');

const path = require('path');
const { errorLogger } = require('../utils/logger');
const Team = require('../models/team');
const Event = require('../models/event');
const templatesPath = path.resolve(__dirname, '../templates');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

router.use(isAuth);

router.get('/', async (req, res) => {
  try {
    const search = req.query.search;
    const page = req.query.page;
    const pageLimit = 30;

    const regex = new RegExp(search ? '^' + search : '', 'i');
    const users = await User.find({ rollNo: regex })
      .limit(pageLimit)
      .skip((page - 1) * pageLimit)
      .select('-_id rollNo criteria moneyOwed department name')
      .exec();
    const maxPage = Math.ceil(
      (await User.countDocuments({ rollNo: regex })) / pageLimit,
    );

    res.send({
      data: {
        users,
        maxPage,
      },
      error: null,
    });
  } catch (err) {
    res.status(500).send({
      data: null,
      error: 'something went wrong',
    });
    errorLogger.log(err);
  }
});

router.post('/', async (req, res) => {
  try {
    let { rollNo, email } = req.body;

    let criteria = {
      1: false,
      2: false,
      3: false,
      C: false,
      T: false,
      F: false,
    };
    if (!validator.isEmail(email)) {
      res.send({
        data: null,
        error: {
          email: 'email not valid',
        },
      });
      return;
    }
    if (!rollNo) {
      const lastUser = await User.findOne({})
        .sort('-rollNo')
        .select('-_id rollNo')
        .exec();
      let maxRollNo = lastUser ? lastUser.rollNo : '900000';
      rollNo = (parseInt(maxRollNo) + 1).toString();
      rollNo = rollNo[0] === '9' ? rollNo : '900000';

      criteria = {
        1: true,
        2: true,
        3: true,
        C: true,
        T: true,
        F: true,
      };
    } else if (!/^[12345]\d{5,6}$/.test(rollNo)) {
      res.send({
        data: null,
        error: {
          rollNo: 'roll number not valid',
        },
      });
      return;
    }

    const userRollNo = await User.findOne({ rollNo });
    if (userRollNo) {
      res.send({
        data: null,
        error: {
          rollNo: 'roll number already taken',
        },
      });
      return;
    }
    const userEmail = await User.findOne({ email });
    if (userEmail) {
      res.send({
        data: null,
        error: {
          email: 'email already taken',
        },
      });
      return;
    }

    const password = await mailer(email, rollNo);

    const user = new User({
      email,
      rollNo,
      criteria,
      department: rollToDept[rollNo[0]],
    });
    await User.register(user, password);

    res.send({
      data: true,
      error: null,
    });
  } catch (err) {
    res.status(500).send({
      data: null,
      error: 'something went wrong',
    });
    console.log(err);
    errorLogger.error(err);
  }
});

router.get('/report', async (req, res) => {
  try {
    const { department, semester } = req.query;

    let users = await User.find(
      { department, semester },
      '-_id rollNo name criteria moneyOwed phoneNumber email',
    )
      .lean()
      .exec();

    users = users.map(({ criteria, moneyOwed, ...rest }) => ({
      ...rest,
      criteria: Object.entries(criteria)
        .filter(([, v]) => v === false)
        .map(([k]) => k)
        .join(' '),
      moneyOwed: '₹' + moneyOwed,
    }));

    const resultPath = path.resolve(
      templatesPath,
      `${department}_${semester}.csv`,
    );

    const csvWriter = createCsvWriter({
      path: resultPath,
      header: [
        { id: 'rollNo', title: 'ROLLNO' },
        { id: 'name', title: 'NAME' },
        { id: 'criteria', title: 'CRTIERIA' },
        { id: 'moneyOwed', title: 'MONEY' },
        { id: 'phoneNumber', title: 'PHONE' },
        { id: 'email', title: 'EMAIL' },
      ],
    });

    await csvWriter.writeRecords(users);

    res.download(resultPath);
  } catch (err) {
    res.status(500).send({
      data: null,
      error: 'something went wrong',
    });
    errorLogger.log(err);
  }
});

router.put('/criteria', async (req, res) => {
  try {
    const { rollNo, criteria } = req.body;

    const user = await User.findOne({ rollNo });
    user.criteria[criteria] = !user.criteria[criteria];
    await user.save();

    res.status(200).send({
      data: true,
      error: null,
    });
  } catch (err) {
    errorLogger.error(err);
    res.status(500).send({
      data: null,
      error: 'something went wrong',
    });
  }
});

router.delete('/event', async (req, res) => {
  try {
    const { rollNo, eventCode } = req.body;

    const user = await User.findOne({ rollNo });
    const event = await Event.findOne({ eventCode: eventCode });

    if (event.teamSize === 1) {
      user.events.pull(event._id);
      user.moneyOwed -= event.entryFee;
      event.registered.pull(user._id);
      user.criteria = {
        1: rollNo[0] === '9',
        2: rollNo[0] === '9',
        3: rollNo[0] === '9',
        C: rollNo[0] === '9',
        T: rollNo[0] === '9',
        F: rollNo[0] === '9',
      };
      await user.execPopulate({ path: 'events', select: '-_id day category' });
      user.events.forEach(({ day, category }) => {
        user.criteria[String(day)] = true;
        user.criteria[category] = true;
      });
      event.seats--;
      await user.save();
      await event.save();
    } else {
      const userTeam = user.eventTeams.filter((e) => {
        return String(e.eventid) == String(event._id);
      });
      const teamId = userTeam[0].teamid;
      const team = await Team.findById(teamId);

      for (let i = 0; i < team.memberRollNos.length; ++i) {
        const u = await User.findOne({ rollNo: team.memberRollNos[i] });
        u.eventTeams = u.eventTeams.filter((e) => {
          return String(e.eventid) != String(event._id);
        });

        if (i === 0) u.moneyOwed -= event.entryFee;

        u.events.pull(event._id);
        u.criteria = {
          1: u.rollNo[0] === '9',
          2: u.rollNo[0] === '9',
          3: u.rollNo[0] === '9',
          C: u.rollNo[0] === '9',
          T: u.rollNo[0] === '9',
          F: u.rollNo[0] === '9',
        };
        await u.execPopulate({ path: 'events', select: '-_id day category' });
        u.events.forEach(({ day, category }) => {
          u.criteria[String(day)] = true;
          u.criteria[category] = true;
        });
        event.registered.pull(teamId);

        await u.save();
        await event.save();
      }
      event.seats--;
      await event.save();
    }

    res.status(200).send({
      data: true,
      error: null,
    });
  } catch (err) {
    errorLogger.error(err);
    res.status(500).send({
      data: null,
      error: 'something went wrong',
    });
  }
});

router.get('/:rollNo', async (req, res) => {
  try {
    const rollNo = req.params.rollNo;

    const user = await User.findOne(
      { rollNo },
      '-_id rollNo criteria moneyOwed department name email events phoneNumber',
    ).populate('events', '-_id eventCode start end entryFee');

    res.send({
      data: user,
      error: null,
    });
  } catch (err) {
    res.send(500).send({
      data: null,
      error: 'something went wrong',
    });
    errorLogger.error(err);
  }
});

module.exports = router;
