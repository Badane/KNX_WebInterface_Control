var express = require('express');
var app = express(); //REST server
var web = express(); //WEB server

var http = require('http');
var url = require('url');
var path = require('path');
var fs = require('fs');

require('./routes')(app);
var methodeKNX = require('./functionsMainKNX');

app.get('/', function(req, res) {
    res.send('Hello Rennes\n');
});

//////////////////////////////////////////////////////

var web = http.createServer(function(request, response) {

  var uri = url.parse(request.url).pathname
    , filename = path.join(process.cwd(), uri);
  
  fs.exists(filename, function(exists) {
    if(!exists) {
      response.writeHead(404, {"Content-Type": "text/plain"});
      response.write("404 Not Found\n");
      response.end();
      return;
    }

    if (fs.statSync(filename).isDirectory()) filename += '/index.html';

    fs.readFile(filename, "binary", function(err, file) {
      if(err) {        
        response.writeHead(500, {"Content-Type": "text/plain"});
        response.write(err + "\n");
        response.end();
        return;
      }

      response.writeHead(200);
      response.write(file, "binary");
      response.end();
    });
  });
});

var io = require('socket.io').listen(web);
exports.io = io;

io.sockets.on('connection', function(socket){
    console.log('Un client est connecté !');
    socket.emit('message','Vous êtes bien connecté !');
    
    methodeKNX.initInterface();
    
    socket.on('message', function (message){
        console.log('message : '+message); 
    });
});


////////////////////////////////////////////////////

app.listen(3001);
console.log('Listening on port 3001...');

web.listen(8080);
console.log('Listening on port 8080...');