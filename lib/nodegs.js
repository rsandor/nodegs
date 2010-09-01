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
 * Utility and helper functions.
 */
function Logger(component, type) {
  component = component || 'nodegs';
  type = type || '';
  return function(msg) {    
    var message = '['+component+']' + (type ? ' ' + type : type) + ': ';
    if (typeof msg == "object") {
      sys.log(message + JSON.stringify(msg));
    }
    else {
      sys.log(message + msg);
    }
  }; 
}

/**
 * Listens for connections and emits remote and local game events.
 */
this.GameServer = (function() {
  var httpServer, socket;
  var shutdown_delay = 500;
  var log = new Logger('GameServer');
  var error = new Logger('GameServer', 'Error');
  
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
    httpServer = http.createServer(/*function(){}*/);
    httpServer.listen(port || options.port);
    socket = io.listen(httpServer);
    
    // Handle connections
    socket.on('connection', function (client) {
      log("Client connected");
      
      client.on('message', function(data) { 
        log("Incoming message");
        try {
          var event = {client:client, data:JSON.parse(data)};
          server.emit('event', event);
        }
        catch (e) {
          error(e);
        }
      });
      
      client.on('disconnect', function() {
        log("Client disconnected");
        server.emit('disconnect', client);
      });
      
      server.emit('connect', client);
    });

    // Setup the SIGINT shutdown handler
    process.addListener("SIGINT", this.shutdown);
    
    log("Server initalized and listening on port " + port);
  };
  
  /**
   * Gracefully handles server shutdown
   */
  Server.prototype.shutdown = function() {
    log("Terminating server in " + (options.shutdown_delay / 1000).toFixed(1) + " seconds...");
    setTimeout(function() {
      log('Server terminated, goodbye!');
      process.exit(0);
    }, options.shutdown_delay);
  };
   
  return Server;
})();

/**
 * Routes and Broadcasts Game Events
 */
this.Router = (function() {
  var log = new Logger('Router')
    , error = new Logger('Router', 'error');
  
  /**
   * The broadcaster class.
   */
  function Router() {
  }
  
  Router.prototype.connect = function(client) {
    log("Connecting...");
  };
  
  /** 
   * Routes and broadcasts a game event.
   * @param event Event to route and broadcast.
   */
  Router.prototype.route = function(event) {
    log("Routing...");
  };
  
  return Router;
})();

