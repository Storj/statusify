'use strict';

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
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
  server = app.listen(config.PORT, cb);
};

const stop = (cb) => {
  server.close(cb);
};

module.exports = {start, stop, app};
