const argon2 = require('argon2');
const faker = require('faker');
const mongoose = require('mongoose');
require('dotenv').config();

const dbCollection = process.env.DB_NAME || 'etamax-admin',
  mongoURL = process.env.MONGO_URL;

mongoose.connect(mongoURL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

const Admin = require('./models/admin');
const User = require('./models/user');
const Event = require('./models/event');
const { randomChoice, randomNumber } = require('./utils/random');
const Payment = require('./models/payment');

const rollToDept = require('./utils/rollToDept');
const Team = require('./models/team');

const addAdmin = async () => {
  try {
    const doc = await Admin.findOne({ username: 'hello' }).exec();
    if (doc === null) {
      const newAdmin = new Admin({
        username: 'hello',
        password: await argon2.hash('generalk123'),
      });
      await newAdmin.save();
      console.log('Added Admin');
    } else {
      console.log('Admin already added');
    }
  } catch (error) {
    console.error(error);
  }
};

const semesterMap = {
  17: 8,
  18: 6,
  19: 4,
  20: 2,
};
const generateUser = (rollNo) => ({
  name: faker.name.firstName() + ' ' + faker.name.lastName(),
  email: rollNo + '@gmail.com',
  rollNo,
  department: rollToDept[rollNo[0]],
  semester: semesterMap[rollNo.slice(2, 4)],
  collegeName: faker.company.companyName(),
  phoneNumber: faker.phone.phoneNumber('##########'),
  hasFilledProfile: true,
});
const addUsers = async () => {
  try {
    if ((await User.countDocuments()) === 6 * 4 * 30) {
      console.log('Users already added');
      return;
    }
    const startTime = new Date();
    console.log('Started adding users');
    await User.deleteMany({});
    for (const dept in rollToDept) {
      for (const sem in semesterMap) {
        for (let i = 1; i <= 30; ++i) {
          let srNo = i.toString();
          srNo = srNo.length === 1 ? '0' + srNo : srNo;
          const rollNo = dept + '0' + sem + srNo;
          await User.register(generateUser(rollNo), '12345');
        }
      }
    }
    const endTime = new Date();
    console.log('Completed adding users', (endTime - startTime) / 1000, 'secs');
  } catch (err) {
    console.log(err);
  }
};

const generateCode = (num) => (100000000000 + num).toString(36).toUpperCase();
const generateTimes = (day) => {
  const startHour = randomNumber(1, 22);
  return {
    start: `${day}-${startHour.toString()}:00`,
    end: `${day}-${(startHour + 1).toString()}:30`,
  };
};
const generateCategory = () => ['C', 'T', 'F'][randomNumber(0, 2)];
const generatePrizeMoney = () => {
  const prizeMoney = [randomNumber(10, 15) * 100];
  for (let i = 0; i < randomNumber(0, 2); ++i) {
    prizeMoney.push(prizeMoney[prizeMoney.length - 1] - 200);
  }
  return prizeMoney;
};
const addEvents = async () => {
  if ((await Event.countDocuments()) === 3 * 15) {
    console.log('Events already added');
    return;
  }
  await Event.deleteMany({});
  const events = [];
  for (let day = 1; day <= 3; ++day) {
    for (let i = 0; i < 15; ++i) {
      events.push({
        eventCode: generateCode(day * 100 + i).toUpperCase(),
        day,
        ...generateTimes(day),
        title: faker.lorem.word(),
        description: faker.lorem.paragraph(),
        image: 'https://via.placeholder.com/150',
        seats: 0,
        maxSeats: 30,
        category: generateCategory(),
        isSeminar: randomChoice(),
        teamSize: randomNumber(1, 4),
        isTeamSizeStrict: randomChoice(),
        entryFee: randomNumber(1, 10) * 100,
        prizeMoney: generatePrizeMoney(),
      });
    }
  }
  await Event.insertMany(events);
  console.log('Added Events');
};

const addPayments = async () => {
  if ((await Payment.countDocuments()) === 100) {
    console.log('Payments already added');
    return;
  }

  await Payment.deleteMany({});
  for (let i = 0; i < 10; ++i) {
    const users = await User.aggregate().sample(10);
    const payments = users.map(({ rollNo }) => ({
      adminUsername: 'hello',
      userRollNo: rollNo,
      amount: randomNumber(1, 10) * 100,
    }));
    Payment.insertMany(payments);
  }
  console.log('Added Payments');
};

const linkEvents = async () => {
  try {
    if ((await Team.countDocuments()) > 0) {
      console.log('Teams already linked');
      return;
    }
    console.log('Started assigning events');
    const startTime = new Date();
    for await (const currEvent of Event.find()) {
      const { day, maxSeats, category, teamSize, entryFee, isTeamSizeStrict } =
        currEvent;

      if (teamSize === 1) {
        const howMany = randomNumber(Math.floor(maxSeats / 2), maxSeats);
        const users = await User.aggregate().sample(howMany).exec();

        await Promise.all(
          users.map(async (user) => {
            await User.findByIdAndUpdate(user._id, {
              [`criteria.${category}`]: true,
              [`criteria.${day}`]: true,
              $inc: { moneyOwed: entryFee },
              $push: { events: currEvent._id },
            });

            await Event.findByIdAndUpdate(currEvent._id, {
              $inc: { seats: 1 },
              $push: { registered: user._id },
            });
          }),
        );
      } else {
        const alreadyHere = new Set();
        async function getUser() {
          let user = null;
          do {
            user = (await User.aggregate().sample(1).exec())[0];
          } while (alreadyHere.has(user.rollNo));
          return user;
        }

        const actualSize = isTeamSizeStrict
          ? randomNumber(Math.floor(teamSize / 2), teamSize)
          : teamSize;
        const howMany = randomNumber(Math.floor(maxSeats / 2), maxSeats);

        for (let i = 0; i < howMany; ++i) {
          const users = await Promise.all(
            [...Array(actualSize)].map(async () => await getUser()),
          );
          const memberRollNos = users.map(({ rollNo }) => rollNo);

          const team = new Team({
            memberRollNos,
            teamName: faker.lorem.words(2),
          });
          const savedTeam = await team.save();

          await Event.findByIdAndUpdate(currEvent._id, {
            $inc: { seats: 1 },
            $push: { registered: savedTeam._id },
          });

          await Promise.all(
            users.map(async ({ _id }, ind) => {
              await User.findByIdAndUpdate(_id, {
                [`criteria.${category}`]: true,
                [`criteria.${day}`]: true,
                $inc: { moneyOwed: ind === 0 ? 0 : entryFee },
                $push: {
                  events: currEvent._id,
                  eventTeams: {
                    eventid: currEvent._id,
                    teamid: savedTeam._id,
                  },
                },
              });
            }),
          );
        }
      }
    }
    const endTime = new Date();
    console.log(
      'Completed assigning events',
      (endTime - startTime) / 1000,
      'secs',
    );
  } catch (err) {
    console.log(err);
  }
};

(async () => {
  await addAdmin();
  await addUsers();
  await addEvents();
  await addPayments();
  await linkEvents();
  mongoose.connection.close();
})();
