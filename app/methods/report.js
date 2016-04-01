module.exports = {
  REPORT: function(rpc, params) {
    // Save the report
    Report.create(params, function(err) {
      var rpcResponse;

      console.log("bleh");

      if (err) {
        console.log("[POST][REPORT] Failed to save report: " + err);
        rpcResponse = {
          "id": rpc.id,
          "result": {
          },
          "error": {
            "code": 500,
            "message": err
          }
        };

        rpc.error(rpcResponse);
      }

      console.log("[POST][REPORT] Report created!");

      rpcResponse = {
        "id": rpc.id,
        "result": {
        }
      };

      rpc.response(rpcResponse);
    });
  }
};
