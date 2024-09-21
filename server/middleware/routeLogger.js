const { routeLogger } = require('../utils/logger');

module.exports = function (req, _res, next) {
  routeLogger.info(`[${req.method.slice(0, 3)}] ~ ${req.url}`);
  next();
};
