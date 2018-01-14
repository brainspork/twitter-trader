const express = require('express');
const router = express.Router();
const Count = require('../models/count');
const Twitter = require('twitter-node-client').Twitter;
const configTwitter = require('../config/twitter');

const twitter = new Twitter({
  "consumerKey" : configTwitter.consumerKey,
  "consumerSecret" : configTwitter.consumerSecret,
  "accessToken" : configTwitter.accessToken,
  "accessTokenSecret" : configTwitter.accessTokenSecret,
  "callBackUrl" : configTwitter.callBackUrl
});

router.post('/count/:symbol', (req, res, next) => {
  let reqData = req.params.symbol;
  let prevData = Count.getCount(reqData, (err, count) => {
    if(err) throw err;
    if(count === null) {
      return undefined;
    } else {
      return count;
    }
  });

  if(prevData != undefined) {
    console.log('here');
    twitter.getSearch({'q':'$' + reqData + ' -filter:retweets','count': 100, 'result_type': 'recent', 'since_id': prevData.prev_tweet_id}, error, success);
  } else {
    twitter.getSearch({'q':'$' + reqData + ' -filter:retweets','count': 100, 'result_type': 'recent'}, error, success);
  }

  function error(err, response, body) {
    console.log('ERROR [%s]', JSON.parse(body));
  }

  function success(data) {
    let tweetObj = JSON.parse(data);
    let tweetArr = tweetObj.statuses;
    let metadata = tweetObj.search_metadata;
    let nextSearchId;
    let prevSearchDate;

    if(tweetArr.length > 0) {
      nextSearchId = tweetArr[0].id_str;
    } else {
      nextSearchId = prevData.prev_tweet_id;
      prevSearchDate = prevData.date;
    }

    let countObj = new Count({
      name: reqData,
      date: prevSearchDate != undefined ? prevSearchDate : new Date(),
      prev_tweet_id: nextSearchId,
      count: tweetArr.length
    });

    Count.addCount(countObj, (err, data) => {
      if(err) {
        res.json({success: false, msg: 'Failed to add count', err});
      } else {
        res.json(data);
      }
    });
  }
});

router.get('/retrieve/:symbol', (req, res, next) => {
  let reqData = req.params.symbol;

  Count.getCount(reqData, (err, data) => {
    if(err) throw err;
    if(data === null) {
      res.send({success: false, msg: 'Failed to find data', err});
    } else {
      res.json(data);
    }
  });
});

module.exports = router;
