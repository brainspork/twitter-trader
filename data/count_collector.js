const express = require('express');
const Minute = require('../models/count_minute');
const Stock = require('../models/stocks');
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

const Collector = module.exports = {};

module.exports.intitateDataCollection = function() {
  Stock.getStocks((err, data) => {
    data.forEach(curr => {
      fetchTwitterData(curr.name);
    });
  });
}

function fetchTwitterData(symbol) {
  let prevId;
  let prevData;

  // Check db for a previous count object
  Minute.getNewestCount(symbol, (err, count) => {
    if(err) throw err;
    if(count == null) {
      // If the symbol has never been searched before get newest id count
      twitter.getSearch({'q':'$' + symbol + ' -filter:retweets','count': 1, 'result_type': 'recent'}, error, success);
    } else {
      prevData = count;
      twitter.getSearch({'q':'$' + symbol + ' -filter:retweets','count': 100, 'result_type': 'recent', 'since_id': prevData.prev_tweet_id}, error, success);
    }
  });

  // Error function for twitter api call
  function error(err, response, body) {
    console.log('ERROR [%s]', JSON.parse(body));
  }

  // Success function for twitter api call
  // Adds new count document to minute collection
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

    let countObj = new Minute({
      name: symbol,
      date: prevSearchDate != undefined ? prevSearchDate : new Date(),
      prev_tweet_id: nextSearchId,
      count: tweetArr.length
    });

    Minute.addCount(countObj, (err, data) => {
      if(err) {
        console.log(err);
      } else {
        console.log(data);
      }
    });
  }
}
