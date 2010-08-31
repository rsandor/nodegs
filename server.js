/*
  server.js
  http://www.github.com/rsandor/nodegs
  By Ryan Sandor Richards
  MIT License Copyright 2010 Ryan Sandor Richards, All Rights Reserved
*/

var sys = require('sys')
  , nodegs = require('./lib/nodegs');

// Check for server version information flag
if (process.argv.length > 1 && process.argv[2] == '--version') {
  sys.puts(nodegs.info.version);
}
// Check for help page
else if (process.argv.length > 1 && process.argv[2] == '--help' || process.argv[2] == '--info') {
  var info = nodegs.info;
  var msg = info.name + " version " + info.version + 
    "\n" + info.copyright + " " + info.author + 
    "\nWebsite: " + info.website;
  sys.puts(msg);
}
// Otherwise start the game server
else {
  // Initialize the game server
  var server = new nodegs.GameServer();
  var broadcaster = new nodegs.Broadcaster();
  
  // Have the broadcaster listen for incoming events 
  server.on('event', broadcaster.route);
  
  // Begin listening for incoming game events
  server.listen(8080);
}
