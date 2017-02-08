'use strict';

const proxyquire = require('proxyquire');
const {EventEmitter} = require('events');
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
};

describe('Statusify - Self Reporting', () => {

  describe('Successful POSTs', () => {

    it('should accept a properly formatted report', (done) => {
      const server = proxyquire('../server', {
        './lib/route': proxyquire('../lib/route', {
          restler: {
            postJson: () => {
              let emitter = new EventEmitter();
              setTimeout(() => emitter.emit('complete'), 10);
              return emitter;
            }
          }
        })
      });
      const reportPOST = {
        method: 'REPORT',
        id: uuid.v4(),
        params: {
          timestamp: Date.now(),
          storageUsed: 100,
          storageAllocated: 1000,
          contactNodeID: Bitcore.crypto.Hash.sha256ripemd160(keys.client.publicKey.toBuffer()).toString('hex'),
          paymentAddress: 'jlk3j4k2j34lkjk2l3k4j23gh423lk4'
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
    it('should reject messages with err when signature is invalid', (done) => {
       const server = proxyquire('../server', {
        './lib/route': proxyquire('../lib/route', {
          restler: {
            postJson: () => {
              let emitter = new EventEmitter();
              setTimeout(() => emitter.emit('complete'), 10);
              return emitter;
            }
          }
        })
      });
      const reportPOST = {
        method: 'REPORT',
        id: uuid.v4(),
        params: {
          timestamp: Date.now(),
          storageUsed: 100,
          storageAllocated: 1000,
          contactNodeID: Bitcore.crypto.Hash.sha256ripemd160(keys.client.publicKey.toBuffer()).toString('hex'),
          paymentAddress: 'jlk3j4k2j34lkjk2l3k4j23gh423lk4'
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
