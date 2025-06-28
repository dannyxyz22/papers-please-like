const { currentRules } = require('./utils/rules');

module.exports = (req, res) => {
  res.status(200).json(currentRules);
};