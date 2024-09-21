const path = require('path');
const slogger = require('simple-node-logger');

const pathOpts = {
  errorEventName: 'error',
  logDirectory: path.join(__dirname, '..', 'logs', 'requests'),
  fileNamePattern: '<DATE>.log',
  dateFormat: 'YYYY.MM.DD',
};
const errorOpts = {
  errorEventName: 'error',
  logDirectory: path.join(__dirname, '..', 'logs', 'errors'),
  fileNamePattern: '<DATE>.log',
  dateFormat: 'YYYY.MM.DD',
};

module.exports = {
  routeLogger: slogger.createRollingFileLogger(pathOpts),
  errorLogger: slogger.createRollingFileLogger(errorOpts),
};
