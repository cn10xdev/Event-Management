const express = require('express');
const app = express();
const helmet = require('helmet');
const mongoose = require('mongoose');
const cors = require('cors');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
require('dotenv').config();

// Route imports
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const eventsRoutes = require('./routes/events');
const paymentsRoutes = require('./routes/payments');
const routeLogger = require('./middleware/routeLogger');

// Constants
const clientURL = process.env.CLIENT_URL || 'http://localhost:3000',
  port = process.env.PORT || 4000,
  dbCollection = process.env.DB_NAME || 'etamax-admin',
  mongoURL = process.env.MONGO_URL,
  sessionSecret = process.env.SESSION || 'etamin',
  prod = process.env.PROD ? true : false;

mongoose.connect(mongoURL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

app.use(helmet());

app.use(
  cors({
    origin: clientURL,
    credentials: true,
  }),
);

app.use(
  session({
    name: 'etamin',
    secret: sessionSecret,
    resave: 'false',
    saveUninitialized: true,
    cookie: {
      httpOnly: true,
      secure: false,
      sameSite: prod ? 'strict' : 'lax',
      maxAge: 1000 * 60 * 60 * 24 * 365 * 10,
    },
    store: new MongoStore({
      mongooseConnection: mongoose.connection,
    }),
  }),
);

require('./models/admin');
require('./models/event');
require('./models/payment');
require('./models/team');
require('./models/user');

app.use(express.json());

app.use(routeLogger);

app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/events', eventsRoutes);
app.use('/payments', paymentsRoutes);

app.listen(port, () => {
  console.log(`🚀 Up at http://localhost:${port}`);
});
