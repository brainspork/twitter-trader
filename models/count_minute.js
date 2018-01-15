const mongoose = require('mongoose');

const CountSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: new Date()
  },
  prev_tweet_id: {
    type: String,
    required: true,
    default: '0X'
  },
  count: {
    type: Number,
    required: true
  }
});

const Minute = module.exports = mongoose.model('Minute', CountSchema);

module.exports.addCount = function(data, callback) {
  data.save(callback);
}

module.exports.getNewestCount = function(symbol, callback) {
  const query = {name: symbol};
  const sort = {sort: {date: -1}};
  Minute.findOne(query, {}, sort, callback);
}

module.exports.getAllCount = function(symbol, callback) {
  const query = {name: symbol};

  Minute.find(query, callback);
}
