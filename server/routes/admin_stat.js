const express = require('express');
const router = express.Router();
const User = require('../models/user'); 
const Event = require('../models/event');
const { errorLogger } = require('../utils/logger');

const isAuth = require('../middleware/isAuth');
router.use(isAuth);

//API for getting total number of users, total events, total amount collected per event.
router.get('', async (req, res) => {
    try {
      const totalUsers = await User.countDocuments();
      const totalEvents = await Event.countDocuments();
      const events = await Event.find({}).lean();
      const totalCollectedPerEvent = await Promise.all(
        events.map(async (event) => {
          const registeredUsers = event.registered.length;
          const totalCollected = registeredUsers * event.entryFee;
  
          return {
            eventId: event._id,
            eventCode: event.eventCode,
            totalCollected,
          };
        })
      );
      res.status(200).send({
        data: {
          totalUsers,
          totalEvents,
          totalCollectedPerEvent,
        },
        error: null,
      });
    } catch (err) {
      errorLogger.error(err);
      res.status(500).send({
        data: null,
        error: 'Something went wrong while fetching admin stats.',
      });
    }
  });
  module.exports = router;