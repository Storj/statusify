// DEFAULTS
// override this in `${environment}.js`

const bitcore = require('bitcore-lib');

module.exports = {
  log: {
    timestamp: true,
    level: 'debug'
  },
  PORT: process.env.PORT || 3000,
  keys: {
    // default config generates new keys each run... override in config/local.js
    statusify: new bitcore.PrivateKey().toString('hex')
  },
  systems: {
    'data-api': 'http://localhost:3001'
  }
};
