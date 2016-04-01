var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ReportSchema = new Schema({
  id: { type: String },
  method: { type: String },
  params: {
    store: {
      free: { type: Number },
      used: { type: Number }
    },
    bandwidth: {
      upload: { type: Number },
      download: { type: Number }
    },
    contact: {
      protocol: { type: String },
      nodeID: { type: String },
      address: { type: String },
      port: { type: Number }
    },
    timestamp: { type: Date },
    payment: { type: String },
    signature: { type: String }
  }
});

ReportSchema.statics.create = function create(reportData, callback) {
  var report = new this(reportData);

  report.verify(function(err) {
    if (err) {
      console.log("[MODEL][REPORT] Error verifying report data: " + err);
      return callback(err);
    }

    report.save(function(err) {
      if (err) {
        console.log("[MODEL][REPORT] Error saving report: " + err);
        return callback(err);
      }
      callback();
    });
  });
};

ReportSchema.methods.verify = function verify(callback) {
  // Do some verification on the data we have for the report
  var report = this;
  var err = null;

  return callback(err);
};

module.exports = mongoose.model('report', ReportSchema);
