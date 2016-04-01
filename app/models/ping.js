var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PingSchema = new Schema({
  store: {
    free: { type: Number },
    used: { type: Number }
  },
  bandwidth: {
    upload: { type: Number },
    download: { type: Number }
  },
  node: {
    id: { type: String },
    ip: { type: String },
    port: { type: Number }
  },
  payment: { type: String },
  signature: { type: String }
});

PingSchema.statics.create = function create(pingData, callback) {
  var ping = new this(pingData);

  ping.verify(function(err) {
    if (err) {
      console.log("[MODEL][PING] Error verifying ping data: " + err);
      return callback(err);
    }

    ping.save(function(err) {
      if (err) {
        console.log("[MODEL][PING] Error saving ping: " + err);
        return callback(err);
      }
      callback();
    });
  });
};

PingSchema.method.verify = function verify(callback) {
  // Do some verification on the data we have for the ping
  var ping = this;

  return callback(err);
};

module.exports = mongoose.model('ping', PingSchema);
