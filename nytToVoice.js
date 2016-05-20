const _ = require('lodash');
const request = require('request');
const moment = require('moment');
const isPhoneNumber = require('is-phone-number');

// API keys
const nytKey = process.env.API_KEY_NYT;
const twillioKey = process.env.API_KEY_TWILLIO;

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

const nytToVoice = (req, res) => {
  const phoneNumber = req.body.phone;

  if (!isPhoneNumber(phoneNumber)) {
    return res.status(500).send(JSON.stringify('Not a valid phone number! (as far as we can tell)'));
  }

  if (!nytKey) {
    return res.status(500).send(JSON.stringify('Missing NYT API key!'));
  }

  if (!twillioKey) {
    return res.status(500).send(JSON.stringify('Missing Twillio API key!'));
  }

  request.get({
    url: 'https://api.nytimes.com/svc/mostpopular/v2/mostviewed/health/1',
    qs: { 'api-key': nytKey },
  }, (err, response, body) => {
    const data = JSON.parse(body);
    const mostPopularStory = getMostPopularStory(data.results);

    if (!mostPopularStory) {
      return res.status(500).send(JSON.stringify('No recent popular articles, apparently!'));
    }

    return res.send(JSON.stringify({ data: mostPopularStory }));
  });
};

module.exports = nytToVoice;

