var changeCase = require('change-case');
var express = require('express');
var routes = require('require-dir')();

module.exports = function(app) {
  'use strict';

  var router = express.Router();

  // Initialize report JSON RPC route
  require('./report')(router);
  app.use('/', router);

  // Initialize all routes
  Object.keys(routes).forEach(function(routeName) {
    var dynRouter = express.Router();
    // You can add some middleware here
    // router.use(someMiddleware);

    // Initialize the route to add its functionality to router
    require('./' + routeName)(dynRouter);

    // Add router to the speficied route name in the app
    app.use('/' + changeCase.paramCase(routeName), dynRouter);
  });
};
