// config/initializers/database.js
var mongoose = require('mongoose');
var config = require('nconf');

module.exports = function(config, callback) {
  'use strict';

  var dbConfig = config.get('database')
  var dbURI = 'mongodb://' + dbConfig.server + '/' + dbConfig.database;
  console.log("DB URI: " + dbURI);

  mongoose.connect(dbURI);

  callback();
};
