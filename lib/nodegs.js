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

/**
 * Module Information
 */
this.info = {
  name: 'nodegs'
  , website: 'http://www.github.com/rsandor/nodegs'
  , version: '0.0.1'
  , author: 'Ryan Sandor Richards'
  , copyright: 'Copyright (c) 2010'
};

/**
 * Listens for and emits remote and local game events.
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
   * The server class
   */
  function Server(opt) {
    EventEmitter.call(this);
    opt = opt || {};
    for (var k in options) {
      options[k] = (opt[k]) ? opt[k] : options[k];
    }
  }
  
  Server.prototype = Object.create(EventEmitter.prototype, {
    constructor:{value:Server, enumerable:false}
  });
   
  
  /**
   * Initializes and starts the game server.
   * @param port Port on which to listen.
   */
  Server.prototype.listen = function(port) {
    var server = this;
    
    // Create the websocket interface
    httpServer = http.createServer(function(){});
    httpServer.listen(port || options.port);
    socket = io.listen(httpServer);
    
    // Handle connections
    socket.on('connection', function (client) {
      sys.log("Client connected");
      
      client.on('message', function(data) {
        sys.log("Incoming message: " + data);
        server.emit('event', JSON.parse(data));
      });
      
      client.on('disconnect', function() {
        sys.log("Client disconnected");
      });
    });

    // Setup the SIGINT shutdown handler
    process.addListener("SIGINT", this.shutdown);
  };
  
  /**
   * Gracefully handles server shutdown
   */
  Server.prototype.shutdown = function() {
    sys.log("Terminating server in " + (options.shutdown_delay / 1000).toFixed(1) + " seconds...");
    setTimeout(function() {
      sys.log('Server terminated, goodbye!');
      process.exit(0);
    }, options.shutdown_delay);
  };
   
  return Server;
})();


/**
 * Routes and Broadcasts Game Events
 */
this.Broadcaster = (function() {
  /**
   * The broadcaster class.
   */
  function Broadcaster() {
  }
  
  /** 
   * Routes and broadcasts a game event.
   * @param event Event to route and broadcast.
   */
  Broadcaster.prototype.route = function(event) {
    console.log("Broadcaster: Routing Event");
    console.log(event);
  };
  
  return Broadcaster;
})();

