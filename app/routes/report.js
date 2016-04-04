// app/routes/report.js

var RPCHandler = require('jsonrpc').RPCHandler;
var Report = require('../models/report');
var reportMethods = require('../methods/report');

module.exports = function(router) {
  'use strict';

  // This will handle the url calls for /report
  router.route('/')
  .get(function(req, res) {
    console.log("[GET][REPORT] Request.body: ", req.body);
    return res.sendStatus(200);
  })
  .post(function(req, res) {
    console.log("Got post for report");
    console.log("request.method is: " + req.method);
    return new RPCHandler(req, res, RPCMethods, true); });
};

RPCMethods = {
  mymethod: function(rpc, params) {
    if(params) {
      rpc.response("got params");
    } else {
      rpc.error("error man...");
    }
  }
}
