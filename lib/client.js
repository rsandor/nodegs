/*
  client.js
  http://www.github.com/rsandor/nodegs
  By Ryan Sandor Richards
  MIT License Copyright 2010 Ryan Sandor Richards, All Rights Reserved
*/
var Client = (function() {
  var socket = null;
  var messageHandlers = [];
  
  /**
   * Default options for the socket connection
   */
  var options = {
    host: 'localhost'
    , socket: {
      port: 8080
      , transports: [
        'websocket'
        , 'flashsocket'
        , 'htmlfile'
        , 'xhr-multipart'
        , 'xhr-polling'
      ]
    }
    , ioPath: "/lib/"
  };
  
  /**
   * Connects the socket to a given host and port.
   */
  function connect(host, port, ioPath) {
    if (socket) return;
    
    host = host || options.host;
    if (port) options.socket.port = port;
    
    io.setPath(ioPath || options.ioPath);
    socket = new io.Socket(host, options.socket);
    socket.connect();
    
    // Add any handlers that were set before connecting
    while(messageHandlers.length > 0) {
      socket.on('message', messageHandlers.shift());
    }
  }
  
  /**
   * Sets a message listener for the client.
   */
  function message(handler) {
    if (socket) {
      socket.on('message', handler);
    }
    else {
      messageHandlers.push(handler);
    }
  }
  
  /**
   * Sends data to the server.
   */
  function send(data) {
    var event = {id:"message",params:{msg:data}};
    socket.send(JSON.stringify(event));
  }
  
  /**
   * Public interface
   */
  return { 
    connect:connect 
    , message: message
    , send: send
  };
})();
