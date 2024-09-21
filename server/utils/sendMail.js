const sgMail = require('@sendgrid/mail');
require('dotenv').config();
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

module.exports = async function (email, rollNo, password) {
  const msg = {
    from: 'etamax_2021@outlook.com',
    to: email,
    subject: 'Login and password for Etamax 2021',
    html:
      `<h1>Etamax 2021</h1>` +
      `<p>
        Dearest Agnelites, <br><br>
        Hope all of you have been safe and having a blast. ✨<a style="color:inherit;text-decoration:none;pointer-events:none;" href="http://bit.do/puipuirollpui" target="_blank">🤩</a><br><br>
        As the dates of etamax are closing by the registrations will be starting.
        The username and password has been provided below. Start registering for the events of your choice. 🔥😇 
      </p>` +
      `<hr>` +
      `<p>Your identification number is <strong> ${rollNo} </strong> </p>` +
      `<p>And the password is <strong> ${password} </strong> </p>`,
  };
  await sgMail.send(msg);
};
