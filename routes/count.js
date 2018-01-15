const express = require('express');
const router = express.Router();
const Minute = require('../models/count_minute');
const Twitter = require('twitter-node-client').Twitter;
const configTwitter = require('../config/twitter');

// Twitter cli connection
const twitter = new Twitter({
  "consumerKey" : configTwitter.consumerKey,
  "consumerSecret" : configTwitter.consumerSecret,
  "accessToken" : configTwitter.accessToken,
  "accessTokenSecret" : configTwitter.accessTokenSecret,
  "callBackUrl" : configTwitter.callBackUrl
});

router.get('/retrieve/:symbol', (req, res, next) => {
  let reqData = req.params.symbol;

  Minute.getNewestCount(reqData, (err, data) => {
    if(err) throw err;
    if(data === null) {
      res.send({success: false, msg: 'Failed to find data', err});
    } else {
      res.json(data);
    }
  });
});

router.get('/retrieve/all/:symbol', (req, res, next) => {
  let reqData = req.params.symbol;

  Minute.getAllCount(reqData, (err, data) => {
    if(err) throw err;
    if(data === null) {
      res.send({success: false, msg: 'Failed to find data', err});
    } else {
      res.json(data);
    }
  });
});

module.exports = router;
