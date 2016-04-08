'use strict';

const log = require('./logger');
const express = require('express');
const router = express.Router();
const Report = require('./model');
const config = require('config');
const Bitcore = require('bitcore-lib');
const Message = require('bitcore-message');
const ipaddr = require('ipaddr.js');
const stringify = require('json-stable-stringify');
const pubkey = new Bitcore.PrivateKey(
  config.keys.payment
).publicKey.toString('hex');

const handle = {
  REPORT: (req, res) => {
    let message, addr, signature;

    try {
      signature = req.body.params.signature;
      addr = Bitcore.Address.fromPublicKeyHash(new Buffer(
        req.body.params.contact.nodeID, 'hex'
      ));
      delete req.body.params.signature;
      message = new Message(stringify(req.body.params));

      if (!message.verify(addr, signature)) {
        throw new Error('Could not verify signature');
      }
    } catch (e) {
      return res.status(400).send({
        id: req.body.id,
        error: { message: e.message },
        result: null
      });
    }

    const reportdata = req.body.params;

    reportdata.requestID = req.body.id;
    reportdata.signature = signature;

    const ip = ipaddr.process(req.ip).toString();
    const report = new Report(reportdata);

    report.save((err) => {
      if (err) {
        log.info(`[request: ${reportdata.requestID}] Invalid request`);
        log.debug(`[request: ${reportdata.requestID}] ${err.stack}`);
        return res.status(500).send({
          id: req.body.id,
          error: { message: 'Could not process report' },
          result: null
        });
      }
      return res.send({id: req.body.id, result: 'Success'});
    });
  },
  KEY: (req, res) => {
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
