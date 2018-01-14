const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const configDatabase = require('./config/database');
const configTwitter = require('./config/twitter');

const Count = require('./routes/count.js');

const PORT = process.env.PORT || 4000;

mongoose.connect(configDatabase.database);
var db = mongoose.connection;

mongoose.connection.on('connected', () => {
  console.log('Connected to database ' + configDatabase.database);
});

app.get('/', function(req, res) {
  res.send('Please use api endpoint');
});

app.use('/api/tracker', Count);

app.listen(PORT);
console.log('Running on port: ' + PORT);
