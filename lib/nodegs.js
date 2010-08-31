/*
  nodegs - A NodeJS Game Server with HTML 5 / Canvas Client
  By Ryan Sandor Richards
  http://www.github.com/rsandor/nodegs
  
  MIT License Copyright 2010 Ryan Sandor Richards, All Rights Reserved
*/

var http = require("http")
  , sys = require("sys")
  , io = require("socket.io");

/**
 * Information and options
 */
this.version = '0.0.1';

/**
 * Game server singelton
 */
this.Server = (function() {
  var server, socket;
  var shutdown_delay = 500;
  
  /**
   * Initializes and starts the server.
   */
  function init(port) {
    port = port || 8080;
    
    // Create the http server
    server = http.createServer(function(req, res){
      /*res.writeHead(200, {"Content-Type":"text/plain"});
      res.end('{}');*/
    })
    server.listen(port);

    // Create the websocket interface
    socket = io.listen(server);
    socket.on('connection', connect);
    
    process.addListener("SIGINT", shutdown);
  }
  
  /**
   * Handles connections
   */
  function connect(client) {
    client.on('message', message);
    client.on('disconnect', disconnect);
  }
  
  /**
   * Handles incoming messages
   */
  function message(data) {
    sys.log("Message Recieved: " + data);
    
    // Simple reverser to test server -> client communications
    var ret = "";
    for (var i = data.length - 1; i >= 0; i--) {
      ret += data.charAt(i);
    }
    
    this.send(ret);
  }

  /**
   * Handles client disconnects
   */
  function disconnect() {
    sys.log("Client disconnected");
  }

  /**
   * Gracefully handles server shutdown
   */
  function shutdown() {
    sys.log("Terminating server in " + (shutdown_delay / 1000).toFixed(1) + " seconds...");
    setTimeout(function() {
      sys.log('Server terminated, goodbye!');
      process.exit(0);
    }, shutdown_delay);
  }
  
  /** 
   * Sets the shutdown delay for the server. The delay allows us to cut connections with clients cleanly.
   */
  function setShutdownDelay(delay) {
    shutdown_delay = delay || 0;
  }
  
  /**
   * Public interface
   */
  return { init:init, setShutdownDelay:setShutdownDelay };
})();
