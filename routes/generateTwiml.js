const twilio = require('twilio');

const generateStoryText = (story) => {
  if (!story) {
    return 'Sorry, no story found!';
  }
  return `${story.title} ${story.abstract}`;
};

const generateTwiml = (story) => {
  const twiml = new twilio.TwimlResponse();
  const options = {
    voice: 'woman',
    language: 'en-gb',
  };

  return twiml.say(generateStoryText(story), options).toString();
};

module.exports = (req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/xml' });
  res.end(generateTwiml(req.app.get('mostPopularStory')));
};
