// Node module vars
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const PORT = process.env.PORT || 6000;

// Config files
const configDatabase = require('./config/database');
const configTwitter = require('./config/twitter');

// Route files
const Count = require('./routes/count.js');

// Data method files
const Collector = require('./data/count_collector');

// Mongo database connection
mongoose.connect(configDatabase.database);
var db = mongoose.connection;

mongoose.connection.on('connected', () => {
  console.log('Connected to database ' + configDatabase.database);
});

app.use(express.static('public'));

// Deployment test area
app.get('/', function(req, res) {
  res.send('Please Use api endpoint');
});

// Enable cors middleware
app.use(cors());

// import router files
app.use('/api/tracker', Count);

app.listen(PORT);
console.log('Running on port: ' + PORT);

setInterval(Collector.intitateDataCollection, 600000);
