/*
  server.js
  Project: nodegs
  Ryan Sandor Richards
  MIT License Copyright 2010 Ryan Sandor Richards, All Rights Reserved
*/

var http = require("http");
var sys = require("sys");
var io = require("socket.io");

//
// Create the http server
//
var server = http.createServer(function(req, res){
  res.writeHead(200, {"Content-Type":"text/plain"});
  res.end('{}');
})
server.listen(8080);

//
// Create the websocket interface
//
var socket = io.listen(server);
socket.on('connection', function(client){
  client.on('message', function(msg){
    sys.log("Message Recieved: " + msg);
    
    // Simple reverser to test server -> client communications
    var ret = "";
    for (var i = msg.length - 1; i >= 0; i--) {
      ret += msg.charAt(i);
    }
    
    client.send(ret);
  })

  client.on('disconnect', function(){
    sys.log("Client disconnected");
  })

  process.addListener("SIGINT", function(){
    sys.log("SERVER CLOSING")
    setTimeout(function(){process.exit(0)}, 3000);
  })
});
