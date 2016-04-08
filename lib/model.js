'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const config = require('config');
const Message = require('bitcore-message');

const Report = new Schema({
  requestID: {type: String, required: true, unique: true},
  storage: {
    free: { type: Number, required: true },
    used: { type: Number, required: true }
  },
  bandwidth: {
    upload: { type: Number, required: true },
    download: { type: Number, required: true }
  },
  contact: {
    protocol: { type: String, required: true },
    nodeID: { type: String, required: true },
    address: { type: String, required: true },
    port: { type: Number, required: true }
  },
  timestamp: { type: Date, required: true, expires: '90d' },
  payment: { type: String, required: true },
  signature: { type: String, required: true }
});

module.exports = mongoose.model('Report', Report);
