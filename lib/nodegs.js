/*
  nodegs - A NodeJS Game Server with HTML 5 / Canvas Client
  By Ryan Sandor Richards
  http://www.github.com/rsandor/nodegs
  
  MIT License Copyright 2010 Ryan Sandor Richards, All Rights Reserved
*/

var http = require("http")
  , sys = require("sys")
  , io = require("socket.io")
  , EventEmitter = require('events').EventEmitter;

// Module Information
this.version = '0.0.1';
this.author = "Ryan Sandor Richards";

/**
 * Game Server
 */
this.GameServer = (function() {
  var httpServer, socket;
  var shutdown_delay = 500;

  // Default server options
  var options = {
    // Port on the server
    port: 8080              
    
    // function(client) - Triggered upon client connection
    , connect: null
    
    // int - Msecs to wait before actual shutdown
    , shutdown_delay: 500
  };

  /**
   * Handles client connections.
   */
  function connect(client) {
    sys.log("Client connected");
    client.on('message', message);
    client.on('disconnect', disconnect);
  }

  /**
   * Handles incoming message data.
   */
  function message(data) {
    sys.log("Message Recieved: " + data);
  }
  
  /**
   * Handles disconnections.
   */
  function disconnect() {
    sys.log("Client disconnected");
  }

  /**
   * Gracefully handles server shutdown
   */
  function shutdown() {
    sys.log("Terminating server in " + (options.shutdown_delay / 1000).toFixed(1) + " seconds...");
    setTimeout(function() {
      sys.log('Server terminated, goodbye!');
      process.exit(0);
    }, options.shutdown_delay);
  }
  
  /**
   * Public interface
   */
  function Server(opt) {
    // Parse user defined options
    opt = opt || {};
    for (var k in options) {
      options[k] = (opt[k]) ? opt[k] : options[k];
    }
  } 
  
  /**
   * Initializes and starts the game server.
   * @param port Port on which to listen.
   */
  Server.prototype.listen = function(port) {
    // Create the websocket interface
    httpServer = http.createServer(function(){});
    httpServer.listen(port || options.port);
    socket = io.listen(httpServer);
    socket.on('connection', connect);

    // Setup the SIGINT shutdown handler
    process.addListener("SIGINT", shutdown);
  };
   
  return Server;
})();
