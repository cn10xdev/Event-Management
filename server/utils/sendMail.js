const SibApiV3Sdk = require("sib-api-v3-sdk");
require("dotenv").config();
let defaultClient = SibApiV3Sdk.ApiClient.instance;

let apiKey = defaultClient.authentications["api-key"];
apiKey.apiKey = process.env.brevoAPIKey;

module.exports = async function (email, rollNo, password) {
  let apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
  let sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

  sendSmtpEmail = {
    sender: {
      name: "Sender Alex",
      email: "testingcoding5@gmail.com",
    },
    to: [
      {
        email: email,
        name: "John Doe",
      },
    ],
    subject: "Login and password for Etamax 2021",
    params: {
      name: "John",
      surname: "Doe",
    },
    headers: {
      "X-Mailin-custom":
        "custom_header_1:custom_value_1|custom_header_2:custom_value_2",
    },
    htmlContent:
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

  apiInstance.sendTransacEmail(sendSmtpEmail).then(
    function (data) {
      console.log("API called successfully. Returned data: " + data);
    },
    function (error) {
      console.error(error);
    }
  );
};

/* const sgMail = require('@sendgrid/mail');
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
 */
