const mongoose = require('mongoose');

const StocksSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  }
});

const Stock = module.exports = mongoose.model('Stock', StocksSchema);

module.exports.getStocks = function(callback) {
  Stock.find(callback)
}
