const express = require('express');
const router = express.Router();
const argon2 = require('argon2');
const { errorLogger } = require('../utils/logger');

const Admin = require('../models/admin');
const isAuth = require('../middleware/isAuth');

router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const doc = await Admin.findOne({ username });
    if (doc === null) {
      res.send({
        data: null,
        error: [{ field: 'username', message: "user doesn't exist" }],
      });
      return;
    }
    if (!(await argon2.verify(doc.password, password))) {
      res.send({
        data: null,
        error: [{ field: 'password', message: 'incorrect password' }],
      });
      return;
    }
    req.session.username = doc.username;
    res.send({
      data: { username: doc.username, name: doc.name },
      error: null,
    });
    req.session.save(err => {
      if (err) console.error({ err });
    });
  } catch (error) {
    errorLogger.error(error);
  }
});

router.post('/logout', isAuth, (req, res) => {
  req.session.destroy(err => {
    if (err) {
      errorLogger.error(err);
      res.send({ data: null, error: 'unknown error occurred' });
    } else {
      res.send({ data: true, error: null });
    }
  });
});

router.get('/me', isAuth, async (req, res) => {
  const username = req.session.username;
  try {
    const user = await Admin.findOne({ username });
    if (user === null) {
      res.send({
        data: null,
        error: "user doesn't exist",
      });
      return;
    }
    res.send({
      data: { username: user.username, name: user.name },
      error: null,
    });
  } catch (error) {
    errorLogger.error(error);
  }
});

module.exports = router;
