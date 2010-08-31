/*
  client.js
  http://www.github.com/rsandor/nodegs
  By Ryan Sandor Richards
  MIT License Copyright 2010 Ryan Sandor Richards, All Rights Reserved
*/
var Client = (function() {
  var socket;
  
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
    host = host || options.host;
    if (port) options.socket.port = port;
    
    io.setPath(ioPath || options.ioPath);
    socket = new io.Socket(host, options.socket);
    socket.connect();
    
    return socket;
  }
  
  /**
   * Sends data to the server.
   */
  function send(data) {
    socket.send(data);
  }
  
  /**
   * Public interface
   */
  return { connect:connect };
})();
