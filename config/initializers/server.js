// config/initializers/server.js

var path = require('path');
var http = require('http');
// Local dependecies
var config = require('nconf');

// create the express app
// configure middlewares
var bodyParser = require('body-parser');
var morgan = require('morgan');
var logger = require('winston');
var app;

var start =  function(callback) {
  'use strict';
  // Configure express

  logger.info('[SERVER] Initializing routes');
  var routes = require('../../app/routes/index');

  http.createServer(function(request, response) {
    routes(request, response);
  }).listen(config.get('NODE_PORT'));

  logger.info('[SERVER] Listening on port ' + config.get('NODE_PORT'));

  if (callback) {
    return callback();
  }
};

module.exports = start;
