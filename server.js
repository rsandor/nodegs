/*
  server.js
  http://www.github.com/rsandor/nodegs
  By Ryan Sandor Richards
  MIT License Copyright 2010 Ryan Sandor Richards, All Rights Reserved
*/

var sys = require('sys')
  , nodegs = require('./lib/nodegs');

// Check for server version information flag
if (process.argv.length > 1 && process.argv[1] == '--version') {
  sys.puts('nodegs version ' + nodegs.version);
}

// Initialize the game server
var gameServer = new nodegs.GameServer(8080);
