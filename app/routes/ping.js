// app/routes/ping.js

var Ping = require('../models/ping');

module.exports = function(router) {
  'use strict';

  // This will handle the url calls for /ping
  router.route('/')
  .get(function(req, res) {
    console.log("[GET][PING] Request.body: ", req.body);
    return res.sendStatus(200);
  })
  .post(function(req, res, next) {
    // Extract the ping data from the request
    var body = req.body;
    //var pingDataJSON = JSON.parse(body);
    var pingDataJSON = body;

    console.log("[POST][PING] Request.body: ", body);

    // TODO: confirm the signature

    // Save the ping
    Ping.create(pingDataJSON, function(err) {
      if (err) {
        console.log("[POST][PING] Failed to save ping: " + err);
        return res.sendStatus(500);
      }

      console.log("[POST][PING] Ping created!");

      return res.sendStatus(200);
    });
  });
};
