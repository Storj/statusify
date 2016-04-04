// app/routes/report.js

var RPCHandler = require('jsonrpc').RPCHandler;
var Report = require('../models/report');
var RPCMethods = require('../methods/report');

module.exports = function(req, res) {
  'use strict';

  // This will handle the url calls for /report
  if ( req.method == "POST" ) {
    console.log("Got post for report");
    console.log("request.method is: " + req.method);
    return new RPCHandler(req, res, RPCMethods, true);
  } else {
    console.log("[GET][REPORT] Request.body: ", req.body);
    return res.sendStatus(200);
  }
};
