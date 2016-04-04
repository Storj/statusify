var http = require("http"),
  RPCHandler = require("jsonrpc").RPCHandler;

http.createServer(function (request, response) {
  if(request.method == "POST"){
    new RPCHandler(request, response, RPCMethods, true);
  }else{
    response.end("Hello world!");
  }
}).listen(4000);

RPCMethods = {
  insert: function(rpc, param1, param2){
    if(param1!=param2)
      rpc.error("Params doesn't match!");
    else
      rpc.response("Params are OK!");
  },
  _private: function(){
    // leading underscore makes method private
    // and not accessible by public RPC interface
  }
}
