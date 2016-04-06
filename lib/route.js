'use strict';

const log = require('./logger');
const express = require('express');
const router = express.Router();
const Report = require('./model');
const config = require('config');
const Bitcore = require('bitcore-lib');
const pubkey = new Bitcore.PrivateKey(config.keys.payment).publicKey.toString('hex');

const handle = {
  report: (req, res) => {
    const reportObj = req.body.params;
    reportObj.requestID = req.body.id;
    const report = new Report(reportObj);
    report.save((err) => {
      if (err) {
        log.warn(err);
        return res.send({id: req.body.id, error: err, result: null});
      }
      return res.send({id: req.body.id, result: 'Success'});
    });
  },
  key: (req, res) => {
    res.send({id: req.body.id, result: pubkey});
  }
};

router.post('/', (req, res) => {
  if (req.body && req.body.id && req.body.method && handle[req.body.method]) {
    handle[req.body.method](req, res);
  } else if (req.body.id) {
    res.send({id: req.body.id, error: `Unknown method: ${req.body.method}`, result: null});
  }
});

module.exports = router;
