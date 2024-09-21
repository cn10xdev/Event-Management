const { rword } = require('rword');
const { randomNumber } = require('./random');
const sendMail = require('./sendMail');

module.exports = async (email, rollNo) => {
  const words = rword.generate(2, {
    length: '3-4',
    capitalize: 'first',
  });
  const password = words[0] + words[1] + randomNumber(100, 999).toString();

  await sendMail(email, rollNo, password);

  return password;
};
