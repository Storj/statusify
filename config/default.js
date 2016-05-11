// DEFAULTS
// override this in `${environment}.js`

const bitcore = require('bitcore-lib');

module.exports = {
  log: {
    timestamp: process.env.LOG_TIMESTAMP || true,
    level: process.env.LOG_LEVEL || 'debug'
  },
  PORT: process.env.PORT || 3000,
  keys: {
    // default config generates new keys each run... override in config/local.js
    statusify: process.env.KEYS_STATUSIFY || new bitcore.PrivateKey().toString('hex')
  },
  systems: {
    'data-api': process.env.SYSTEMS_DATA-API || 'http://localhost:3001'
  }
};
