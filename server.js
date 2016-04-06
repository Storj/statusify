'use strict';

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const routes = require('./lib/route');
const config = require('config');

const app = express();
app.enable('trust proxy');
app.use(cors());
app.options('*', cors());
app.use(bodyParser.json({limit: '1kb'}));
app.use(routes);

let server;

const start = (cb) => {
  mongoose.connect(config.DB);
  const db = mongoose.connection;
  db.on('error', cb);
  db.once('open', () => {
    server = app.listen(config.PORT, cb);
  });
};

const stop = (cb) => {
  server.close(() => {
    return mongoose.disconnect(() => {
      if (cb) { return cb(); }
    });
  });
};

module.exports = {start, stop, app};
