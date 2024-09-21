const mongoose = require('mongoose');
const argon2 = require('argon2');
const Admin = require('./models/admin');
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
    const [, , username, password] = process.argv;
    const find = await Admin.findOne({ username });

    if (find) {
      find.password = await argon2.hash(password);
      await find.save();
      console.log('Password changed');
      mongoose.connection.close();
      return;
    }
    const newAdmin = new Admin({
      username: username,
      password: await argon2.hash(password),
    });
    await newAdmin.save();
    console.log('Added Admin');
    mongoose.connection.close();
  } catch (err) {
    console.error(err.message);
  }
})();
