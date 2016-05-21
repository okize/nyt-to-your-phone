/* eslint no-console: 0 */

const twilio = require('twilio');

const generateTwiml = (req, res) => {
  const twiml = new twilio.TwimlResponse();

  res.writeHead(200, { 'Content-Type': 'text/xml' });
  res.end(twiml.say('Hello').toString());
};

module.exports = generateTwiml;
