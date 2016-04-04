var changeCase = require('change-case');
var routes = require('require-dir')();

module.exports = function(request, response) {
  'use strict';

  // Initialize report JSON RPC route
  require('./report')(request, response);
};
