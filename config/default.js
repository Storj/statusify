// DEFAULTS
// override this in `${environment}.js`

const bitcore = require('bitcore-lib');

module.exports = {
  log: {
    timestamp: true,
    level: 'debug'
  },
  DB: process.env.DB || 'mongodb://localhost:27017/statusify',
  PORT: process.env.PORT || 3000,
  keys: {
    // default config generates new keys each run...
    payment: new bitcore.PrivateKey().toString('hex')
  }
};
