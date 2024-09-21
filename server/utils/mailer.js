const nodemailer = require('nodemailer');
const { rword } = require('rword');
const { randomNumber } = require('./random');
require('dotenv').config();

const senderEmail = process.env.MAIL;
const senderPass = process.env.PASS;

module.exports = async (email, rollNo) => {
  const words = rword.generate(2, {
    length: '3-4',
    capitalize: 'first',
  });
  const password = words[0] + words[1] + randomNumber(100, 999).toString();

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

  await trasporter.sendMail({
    from: senderEmail,
    to: email,
    subject: 'Login and password for Etamax 2021',
    html:
      `<h1>Etamax 2021</h1>` +
      `<p>
    Dearest Participants, <br>
    Hope all of you have been safe and having a blast. ✨<a style="color:inherit;text-decoration:none;pointer-events:none;" href="http://bit.do/puipuirollpui" target="_blank">🤩</a>
    As the dates of etamax are closing by the registrations will be starting.
    The username and password has been provided below. Start registering for the events of your choice. 🔥😇 
    </p>` +
      `<hr>` +
      `<p>Your identification number is <strong> ${rollNo} </strong> </p>` +
      `<p>And the password is <strong> ${password} </strong> </p>`,
  });

  return password;
};
