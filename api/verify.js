const { verifyDocument } = require('./utils/rules');

module.exports = (req, res) => {
  if (req.method === 'POST') {
    const document = req.body.document;
    const result = verifyDocument(document);
    res.status(200).json(result);
  } else {
    res.status(405).send('Method Not Allowed');
  }
};