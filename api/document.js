const { generateDocument } = require('./utils/rules');

module.exports = (req, res) => {
  res.status(200).json(generateDocument());
};