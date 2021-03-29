// Mostly from
// https://github.com/lmccart/itp-creative-js/tree/master/Spring-2014/week6/04_socket_server
// Which is
// Based off of Shawn Van Every's Live Web
// http://itp.nyu.edu/~sve204/liveweb_fall2013/week3.html

var http = require('http');
var url = require('url');
var path = require('path');
var fs = require('fs');
const fetch = require("node-fetch");

const PORT = process.env.PORT || '8080';
var server = http.createServer(handleRequest);
server.listen(PORT);

console.log('Server started on port 8080');

function handleRequest(req, res) {
    var parseObj = url.parse(req.url, true);
    var pathname = parseObj.pathname;
    var params  = parseObj.query;
    console.log(params);

    if (pathname == '/' && params.page == undefined) {
        console.log("index");
        pathname = '/index.html';
    } else if (pathname == '/' && params.page != undefined){
        console.log("page");
        pathname = '/page.html';
    }

    var ext = path.extname(pathname);

    var typeExt = {
        '.html': 'text/html',
        '.js':   'text/javascript',
        '.css':  'text/css',
        '.frag':  'text/glsl',
    };

    var contentType = typeExt[ext] || 'text/plain';

    fs.readFile(__dirname + pathname,
                function (err, data) {
                    if (err) {
                        res.writeHead(500);
                        console.log("ERRRRRRR!");
                        console.log(err);
                        return res.end('Error loading ' + pathname);
                    }
                    res.writeHead(200,{ 'Content-Type': contentType });
                    res.end(data);
                }
               );
}


var io = require('socket.io').listen(server);
io.sockets.on('connection',
              function (socket) {
                  socket.on('mouse',
                            function(data) {
                                socket.broadcast.emit('mouse', data);
                            }
                           );
                  socket.on('disconnect', function() {
                      console.log("Client has disconnected");
                  });
              }
             );
