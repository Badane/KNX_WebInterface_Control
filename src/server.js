var express = require('express');
var app = express();

var http = require('http');
var fs = require('fs');

require('./routes')(app);

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/', function(req, res) {
    res.send('Hello Rennes\n');
});

//////////////////////////////////////////////////////

var web = http.createServer(function(req,res){
    fs.readFile('../HTML/index.html', 'utf-8', function(error,content){
        res.writeHead(200, {"Content-Type": "text/html"});
        res.end(content);
    }); 
});

var io = require('socket.io').listen(web);
exports.io = io;

io.sockets.on('connection', function(socket){
    console.log('Un client est connecté !');
    socket.emit('message','Vous êtes bien connecté !');
    
    socket.on('message', function (message){
        console.log('message : '+message); 
    });
});


////////////////////////////////////////////////////

app.listen(3001);
console.log('Listening on port 3001...');

web.listen(8080);
console.log('Listening on port 8080...');



