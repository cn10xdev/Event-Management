const User = require('../models/user');
const Event = require('../models/event');
const Payment = require('../models/payment');
const rollToDept = require('./rollToDept');

module.exports = {
  deleteUser: rollNo => {
    (async () => {
      await User.findOne({ rollNo: rollNo }, 'events')
        .populate('events')
        .exec()
        .then(docs => {
          for (let i = 0; i < docs.length; ++i) {
            Event.find({ _id: docs[i] }, (err, event) => {
              event.seats++;
              event.registered.pull(docs._id);
              event.save(err => {
                if (err) console.log(err);
              });
            });
          }
        });
      await User.deleteOne({ rollNo: rollNo }, err => {
        if (err) console.log(err);
      });
    })();
  },
  processPayment: (rollNo, amount, admin) => {
    (async () => {
      const payment = new Payment({
        adminUsername: admin,
        rollNo: rollNo,
        amount: amount,
      });
      await payment.save();
      await User.findOne({ rollNo: rollNo }, 'moneyOwed')
        .exec()
        .then(docs => {
          docs.moneyOwed -= amount;
          docs.save();
        });
    })();
  },
  generateUser: (name, email) => {
    const regex = new RegExp('9' ? '^' + '9' : '', 'i');
    let lastRoll = 0;
    return (async () => {
      await User.find({ rollNo: regex })
        .exec()
        .then(docs => {
          console.log(docs);
          if (docs.length > 0) lastRoll = Number(docs[docs.length - 1].rollNo);
          else lastRoll = 900000;
        });
      const newUser = new User({
        name: name,
        email: email,
        rollNo: lastRoll + 1,
        department: 'OTHER',
        // password: 'abcd',
        tokens: [],
      });
      await newUser.save();
      return newUser;
      // console.log(lastRoll);
    })();
  },
  generateUserR: (rollNo, email) => {
    return new User({
      email: email,
      rollNo: rollNo,
      department: rollToDept[rollNo[0]],
      tokens: [],
    });
  },
};
