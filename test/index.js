'use strict';

const server = require('../server');
const mongoose = require('mongoose');
const request = require('supertest');
const expect = require('chai').expect;
const uuid = require('node-uuid');
const config = require('config');
const Bitcore = require('bitcore-lib');
const Message = require('bitcore-message');
const ecies = require('bitcore-ecies');
const _ = require('lodash').mixin(require('lodash-keyarrange'));

const keys = {
  client: new Bitcore.PrivateKey(),
  payment: new Bitcore.PrivateKey(config.keys.payment)
};

describe('Statusify - Self Reporting', () => {

  before((cb) => {
    server.start(cb);
  });

  after((cb) => {
    mongoose.connection.db.dropDatabase(() => {
      server.stop(cb);
    });
  });

  describe('Successful POSTs', () => {
    const keyPOST = {
      method: 'key',
      id: uuid.v1(),
      params: {}
    }

    it('should accept a properly formatted key request and respond with pubkey', (done) => {
      request(server.app)
        .post('/')
        .send(keyPOST)
        .set('Accept', 'application/json')
        .end((err, res) => {
          expect(err).to.equal(null);
          expect(res.body.error).to.not.exist;
          expect(res.body.result).to.exist;
          expect(res.body.result).to.equal(keys.payment.publicKey.toString('hex'));
          done();
        });
    });

    it('should accept a properly formatted report', (done) => {
      const reportPOST = {
        method: 'report',
        id: uuid.v1(),
        params: {
          timestamp: Date.now(),
          'storage': {
            'free': 1000,
            'used': 100
          },
          'bandwidth': {
            'upload': 10.5,
            'download': 100.8
          },
          'contact': {
            'protocol': 'superawesomeprotol',
            'nodeID': Bitcore.crypto.Hash.sha256ripemd160(keys.client.publicKey.toBuffer()).toString('hex'),
            'address': '10.10.1.15',
            'port': 1234
          },
          'payment': ecies().privateKey(keys.client).publicKey(keys.payment.publicKey).encrypt('jlk3j4k2j34lkjk2l3k4j23gh423lk4').toString('base64')
        }
      };

      const paramsSorted = _.keyArrangeDeep(reportPOST.params);
      reportPOST.params.signature = new Message(JSON.stringify(paramsSorted)).sign(keys.client);

      request(server.app)
        .post('/')
        .send(reportPOST)
        .set('Accept', 'application/json')
        .end((err, res) => {
          expect(err).to.equal(null);
          expect(res.body.id).to.equal(reportPOST.id);
          expect(res.body.error).to.not.exist;
          expect(res.body.result).to.equal('Success');
          done();
        });
    });
  });

  describe('Unsuccessful POSTs', () => {
    it('should reject messages with err when payment address can not be decrypted', (done) => {
      const reportPOST = {
        method: 'report',
        id: uuid.v1(),
        params: {
          pubkey: keys.client.publicKey.toString('hex'),
          timestamp: Date.now(),
          'storage': {
            'free': 1000,
            'used': 100
          },
          'bandwidth': {
            'upload': 10.5,
            'download': 100.8
          },
          'contact': {
            'protocol': 'superawesomeprotol',
            'nodeID': Bitcore.crypto.Hash.sha256ripemd160(keys.client.publicKey.toBuffer()).toString('hex'),
            'address': '10.10.1.15',
            'port': 1234
          },
          'payment': 'jlk3j4k2j34lkjk2l3k4j23gh423lk4'
        }
      };

      const paramsSorted = _.keyArrangeDeep(reportPOST.params);
      reportPOST.params.signature = new Message(JSON.stringify(paramsSorted)).sign(keys.client);

      request(server.app)
        .post('/')
        .send(reportPOST)
        .set('Accept', 'application/json')
        .end((err, res) => {
          expect(err).to.equal(null);
          expect(res.body.id).to.equal(reportPOST.id);
          expect(res.body.error).to.exist;
          expect(res.body.result).to.not.exist;
          done();
        });
    });

    it('should reject messages with err when signature is invalid', (done) => {
      const reportPOST = {
        method: 'report',
        id: uuid.v1(),
        params: {
          pubkey: keys.client.publicKey.toString('hex'),
          timestamp: Date.now(),
          'storage': {
            'free': 1000,
            'used': 100
          },
          'bandwidth': {
            'upload': 10.5,
            'download': 100.8
          },
          'contact': {
            'protocol': 'superawesomeprotol',
            'nodeID': Bitcore.crypto.Hash.sha256ripemd160(keys.client.publicKey.toBuffer()).toString('hex'),
            'address': '10.10.1.15',
            'port': 1234
          },
          'payment': ecies().privateKey(keys.client).publicKey(keys.payment.publicKey).encrypt('jlk3j4k2j34lkjk2l3k4j23gh423lk4').toString('base64')
        }
      };

      const paramsSorted = _.keyArrangeDeep(reportPOST.params);
      reportPOST.params.signature = 'blah';

      request(server.app)
        .post('/')
        .send(reportPOST)
        .set('Accept', 'application/json')
        .end((err, res) => {
          expect(err).to.equal(null);
          expect(res.body.id).to.equal(reportPOST.id);
          expect(res.body.error).to.exist;
          expect(res.body.result).to.not.exist;
          done();
        });
    });
  });

});
