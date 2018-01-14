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

const Count = module.exports = mongoose.model('Count', CountSchema);

module.exports.addCount = function(data, callback) {
  data.save(callback);
}

module.exports.getNewestCount = function(symbol, callback) {
  const query = {name: symbol};
  const sort = {sort: {date: -1}};
  Count.findOne(query, {}, sort, callback);
}

module.exports.getAllCount = function(symbol, callback) {
  const query = {name: symbol};

  Count.find(query, callback);
}
