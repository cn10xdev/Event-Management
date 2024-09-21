const express = require('express');
const router = express.Router();

const Event = require('../models/event');

const isAuth = require('../middleware/isAuth');
const eventValidation = require('../utils/eventValidation');

const path = require('path');
const { errorLogger } = require('../utils/logger');
const templatesPath = path.join(__dirname, '../templates');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

router.use(isAuth);

router.get('/report/:eventCode', async (req, res) => {
  try {
    const eventCode = req.params.eventCode;

    const event = await Event.findOne({ eventCode });
    if (event.teamSize === 1) {
      await event.execPopulate({
        path: 'registered',
        model: 'User',
        select: '-_id rollNo name phoneNumber email moneyOwed',
        options: { lean: true },
      });

      const resultPath = path.resolve(templatesPath, `event_${eventCode}.csv`);
      const csvWriter = createCsvWriter({
        path: resultPath,
        header: [
          { id: 'rollNo', title: 'ROLLNO' },
          { id: 'name', title: 'NAME' },
          { id: 'phoneNumber', title: 'PHONE' },
          { id: 'email', title: 'EMAIL' },
          { id: 'moneyOwed', title: 'MONEY' },
        ],
      });

      await csvWriter.writeRecords(event.registered);

      res.download(resultPath);
    } else {
      await event.execPopulate({
        path: 'registered',
        model: 'Team',
        select: '-_id teamName memberRollNos',
        options: { lean: true },
        populate: [
          {
            path: 'members',
            select: '-_id rollNo name phoneNumber email moneyOwed',
            options: { lean: true },
          },
        ],
      });

      const resultPath = path.resolve(templatesPath, `event_${eventCode}.csv`);

      const data = [];
      event.registered.forEach(({ teamName, members }) => {
        data.push({
          teamName: teamName,
          rollNo: members[0].rollNo,
          name: members[0].name,
          email: members[0].email,
          phoneNumber: members[0].phoneNumber,
          moneyOwed: members[0].moneyOwed,
        });
        members.slice(1).forEach(member => {
          data.push({
            rollNo: member.rollNo,
            name: member.name,
            email: member.email,
            phoneNumber: member.phoneNumber,
            moneyOwed: member.moneyOwed,
          });
        });
      });

      const csvWriter = createCsvWriter({
        path: resultPath,
        header: [
          { id: 'teamName', title: 'TEAM' },
          { id: 'rollNo', title: 'ROLLNO' },
          { id: 'name', title: 'NAME' },
          { id: 'phoneNumber', title: 'PHONE' },
          { id: 'email', title: 'EMAIL' },
          { id: 'moneyOwed', title: 'MONEY' },
        ],
      });

      await csvWriter.writeRecords(data);

      res.download(resultPath);
    }
  } catch (err) {
    res.sendStatus(500);
    errorLogger.error(err);
  }
});

router.get('/:eventCode', async (req, res) => {
  try {
    const eventCode = req.params.eventCode;
    const event = await Event.findOne(
      { eventCode },
      '-_id eventCode day start end title description image maxSeats category isSeminar teamSize isTeamSizeStrict entryFee prizeMoney'
    );
    if (eventCode) {
      res.send({
        data: event,
        error: null,
      });
    } else {
      res.send({
        data: null,
        error: 'event not found',
      });
    }
  } catch (err) {
    res.status(500).send({
      data: null,
      error: 'something went wrong',
    });
    errorLogger.error(err);
  }
});

router.put('/:eventCode', async (req, res) => {
  try {
    const eventCode = req.params.eventCode;

    const {
      processed: { eventCode: _, ...otherFields },
      errors: { eventCode: eventCodeError, ...otherErrors },
    } = await eventValidation(req.body);

    if (
      eventCodeError === 'already exists' &&
      Object.keys(otherErrors).length === 0
    ) {
      await Event.findOneAndUpdate({ eventCode }, otherFields, {
        new: true,
      });
      res.send({
        data: true,
        error: null,
      });
    } else {
      res.send({
        data: null,
        error: otherErrors,
      });
    }
  } catch (err) {
    res.status(500).send({
      data: null,
      error: 'something went wrong',
    });
    errorLogger.error(err);
  }
});

router.get('/pages/:day', async (req, res) => {
  try {
    const day = req.params.day;
    const events = await Event.find(
      { day },
      '-_id eventCode seats maxSeats start title isSeminar category teamSize'
    );
    res.send({
      data: events,
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
    const { processed, errors } = await eventValidation(req.body);

    if (Object.keys(errors).length === 0) {
      const event = new Event(processed);
      await event.save();
      res.send({
        data: true,
        error: null,
      });
    } else {
      res.send({
        data: null,
        error: errors,
      });
    }
  } catch (err) {
    res.status(500).send({
      data: null,
      error: 'something went wrong',
    });
    errorLogger.error(err);
  }
});

module.exports = router;
