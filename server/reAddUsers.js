const mongoose = require('mongoose');
const fs = require('fs');
const csv = require('csv-parser');
const User = require('./models/user');
const userQueries = require('./utils/userQueries');
const nodemailer = require('nodemailer');
const { rword } = require('rword');
const { randomNumber } = require('./utils/random');
const nodemailerSendgrid = require('nodemailer-sendgrid');
require('dotenv').config();

const dbCollection = process.env.DB_NAME || 'etamax-admin',
  mongoURL = process.env.MONGO_URL;

const senderEmail = process.env.MAIL;
const senderPass = process.env.PASS;
const sendgridKey = process.env.SENDGRID_API_KEY;

mongoose.connect(mongoURL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

(async () => {
  try {
    const [, , file] = process.argv;

    const trasporter = nodemailer.createTransport({
      service: 'hotmail',
      auth: {
        user: senderEmail,
        pass: senderPass,
      },
      tls: {
        ciphers: 'SSLv3',
      },
      pool: true,
      maxConnections: 3,
      maxMessages: 1,
    });

    await fs
      .createReadStream(file)
      .pipe(csv())
      .on('data', async (data) => {
        try {
          const words = rword.generate(2, {
            length: '3-4',
            capitalize: 'first',
          });
          const password =
            words[0] + words[1] + randomNumber(100, 999).toString();
          const user = await userQueries.generateUserR(data.roll, data.email);

          await trasporter.sendMail({
            from: senderEmail,
            to: data.email,
            subject: 'Login and password for Etamax 2021',
            html:
              `<h1>Etamax 2021</h1>` +
              `<p>
          Dearest Agnelites, <br>
          Hope all of you have been safe and having a blast. ✨<a style="color:inherit;text-decoration:none;pointer-events:none;" href="http://bit.do/puipuirollpui" target="_blank">🤩</a>
          As the dates of etamax are closing by the registrations will be starting.
          The username and password has been provided below. Start registering for the events of your choice. 🔥😇 
          </p>` +
              `<hr>` +
              `<p>Your identification number is <strong> ${data.roll} </strong> </p>` +
              `<p>And the password is <strong> ${password} </strong> </p>`,
          });
          try {
            await User.register(user, password);
          } catch (err) {
            await user.setPassword(password);
          }
          console.log('registered ', data.roll);
        } catch (err) {
          console.log(err);
        }
      });
  } catch (err) {
    console.log(err);
  }
})();

// mongoose.connection.close();
