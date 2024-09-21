module.exports = function (req, res, next) {
  if (req.session.username) next();
  else res.send({ data: null, error: 'not authenticated' });
};
