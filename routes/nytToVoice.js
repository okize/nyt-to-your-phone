/* eslint no-console: 0 */

const _ = require('lodash');
const twilio = require('twilio');
const request = require('request');
const moment = require('moment');
const isPhoneNumber = require('is-phone-number');

// API keys
const nytToken = process.env.NYT_TOKEN;
const twilioId = process.env.TWILIO_SID;
const twilioToken = process.env.TWILIO_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE;

const sortByViews = (arr) => _.orderBy(arr, ['views'], ['desc']);

const getMostPopularStory = (results) => {
  const dateFormat = 'YYYY-MM-DD';
  const today = moment().format(dateFormat);
  const yesterday = moment().subtract(1, 'day').format(dateFormat);

  const stories = {
    today: [],
    yesterday: [],
  };

  results.forEach((res) => {
    if (res.published_date === today) {
      stories.today.push(res);
    }
    if (res.published_date === yesterday) {
      stories.yesterday.push(res);
    }
  });

  if (stories.today.length) {
    return sortByViews(stories.today)[0];
  } else if (stories.yesterday.length) {
    return sortByViews(stories.yesterday)[0];
  }
  return null;
};

const sendVoiceMessage = (phoneNumber) => {
  const client = twilio(twilioId, twilioToken);

  client.makeCall({
    to: phoneNumber,
    from: twilioPhoneNumber,
    url: 'http://nyt-to-your-phone.herokuapp.com/api/twiml.xml',
  }, (err, call) => {
    console.log(call.id);
  });
};

const nytToVoice = (req, res) => {
  const phoneNumber = req.body.phone;

  if (!isPhoneNumber(phoneNumber)) {
    return res.status(500).send(JSON.stringify('Not a valid phone number!'));
  }

  if (!nytToken) {
    return res.status(500).send(JSON.stringify('Missing New York Times environment variable'));
  }

  if (!twilioId || !twilioToken || !twilioPhoneNumber) {
    return res.status(500).send(JSON.stringify('Missing Twilio environment variable(s)'));
  }

  return request.get({
    url: 'https://api.nytimes.com/svc/mostpopular/v2/mostviewed/health/1',
    qs: { 'api-key': nytToken },
  }, (err, response, body) => {
    const data = JSON.parse(body);
    const mostPopularStory = getMostPopularStory(data.results);

    if (!mostPopularStory) {
      return res.status(500).send(JSON.stringify('No recent popular articles, apparently!'));
    }

    // set global so that twiml.xml route has access to headline
    req.app.set('mostPopularStory', mostPopularStory);

    sendVoiceMessage(phoneNumber, mostPopularStory);

    return res.send(JSON.stringify({ data: `Calling ${phoneNumber}...` }));
  });
};

module.exports = nytToVoice;
