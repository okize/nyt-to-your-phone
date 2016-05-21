/* eslint no-console: 0 */

const nytToVoice = require('./nytToVoice.js');
const generateTwiml = require('./generateTwiml.js');

const apiRoutes = (app, express) => {
  const api = express.Router();

  api.post('/phone', (req, res) => {
    nytToVoice(req, res);
  });

  api.post('/twiml.xml', (req, res) => {
    generateTwiml(req, res);
  });

  app.use('/api', api);
};

module.exports = apiRoutes;
