const mongoose = require('mongoose');
const fs = require('fs');
const csv = require('csv-parser');
const User = require('./models/user');
const userQueries = require('./utils/userQueries');
const { rword } = require('rword');
const { randomNumber } = require('./utils/random');
const sendMail = require('./utils/sendMail');
require('dotenv').config();

const dbCollection = process.env.DB_NAME || 'etamax-admin',
  mongoURL = process.env.MONGO_URL;

mongoose.connect(mongoURL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

(async () => {
  try {
    const [, , file] = process.argv;

    fs.createReadStream(file)
      .pipe(csv())
      .on('data', async (data) => {
        try {
          const words = rword.generate(2, {
            length: '3-4',
            capitalize: 'first',
          });
          const password =
            words[0] + words[1] + randomNumber(100, 999).toString();

          await sendMail(data.email, data.roll, password);
          const user = userQueries.generateUserR(data.roll, data.email);
          await User.register(user, password);
          console.log('registered ', data.roll);
        } catch (err) {
          console.error(err);
        }
      });
  } catch (err) {
    console.err(err);
  }
})();
