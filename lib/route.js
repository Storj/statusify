'use strict';

const log = require('./logger');
const express = require('express');
const router = express.Router();
const Report = require('./model');
const config = require('config');
const Bitcore = require('bitcore-lib');
const ipaddr = require('ipaddr.js');
const pubkey = new Bitcore.PrivateKey(config.keys.payment).publicKey.toString('hex');

const handle = {
  REPORT: (req, res) => {
    const reportObj = req.body.params;
    reportObj.requestID = req.body.id;
    const ip = ipaddr.process(req.ip).toString();
    const report = new Report(reportObj);
    report.save((err) => {
      if (err) {
        log.info(`[request: ${reportObj.requestID}] Invalid request`);
        log.debug(`[request: ${reportObj.requestID}] ${err.stack}`);
        return res.send({id: req.body.id, error: 'Could not process report', result: null});
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
    log.info(`[request: ${req.body.id}] Unknown method: ${req.body.method}`);
    res.send({id: req.body.id, error: `Unknown method: ${req.body.method}`, result: null});
  } else {
    log.info(`[request: N/A] Incorrect report format`);
    res.send({error: `Incorrect report format`, result: null});
  }
});

module.exports = router;
