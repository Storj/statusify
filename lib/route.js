'use strict';

const log = require('./logger');
const express = require('express');
const router = express.Router();
const config = require('config');
const Bitcore = require('bitcore-lib');
const Message = require('bitcore-message');
const stringify = require('json-stable-stringify');
const _ = require('lodash').mixin(require('lodash-keyarrange'));
const keys = {
  statusify: new Bitcore.PrivateKey(config.keys.statusify)
};
const address = Bitcore.crypto.Hash.sha256ripemd160(keys.statusify.publicKey.toBuffer()).toString('hex');
log.info(`Using system address ${address}`);
const request = require('restler');

const handle = {
  REPORT: (req, res) => {
    // check signature
    try {
      const body = req.body;
      const signature = body.params.signature;
      const addr = Bitcore.Address.fromPublicKeyHash(new Buffer(
        body.params.contact.nodeID, 'hex'
      ));
      delete body.params.signature;
      const message = new Message(stringify(body.params));
      body.params.signature = signature;

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

    // create new message wrapping original message, sign it as statusify for data-api
    const message = {
      id: req.body.id,
      method: 'report.put',
      params: {
        address,
        message: req.body
      }
    };

    const paramsSorted = _.keyArrangeDeep(message.params);
    message.params.signature = new Message(JSON.stringify(paramsSorted)).sign(keys.statusify);

    request.postJson(config.systems['data-api'], message).on('complete', (data) => {
      if (data && data instanceof Error) {
        log.info(`[request: ${message.id}] Error sending to data-api: ${data.message}`);
        return res.status(500).send({
          id: req.body.id,
          error: { message: 'Could not process report' },
          result: null
        });
      }
      if (data && data.error) {
        log.info(`[request: ${message.id}] Error sending to data-api: ${data.error.message}`);
        return res.status(500).send({
          id: req.body.id,
          error: { message: 'Could not process report' },
          result: null
        });
      }
      return res.send({id: req.body.id, result: 'Success'});
    });
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
