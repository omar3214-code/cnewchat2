var app = require("express")();
var http = require("http").Server(app);
var fs = require("fs");
var io = require("socket.io")(http);

app.get('/', onRequest);
app.get('/js/client.js', function(req, res) {
  res.sendFile(__dirname + "/js/client.js");
});

app.get('/js/room.js', function(req, res) {
  res.sendFile(__dirname + "/js/room.js");
});

http.listen(process.env.PORT || 3000, function() {
  console.log('server started');
})

//404 response
function send404(response) {
  response.writeHead(404, {"Content-Type" : "text/plain"});
  response.write("Error 404: Page not found");
  response.end();
}
function appGet(urlPath, fileExtension){
    app.get(urlPath, function(req, res){
      var path = __dirname + fileExtension;
      console.log("loading " + path);
       res.sendFile(__dirname + fileExtension);
    });
}
function onRequest(request, response) {
  var room = request.query.room;
  console.log("room id: " + room);
  fs.createReadStream("./index.html").pipe(response);
}

io.on('connection', function(socket) {
  console.log("a user connected");
  socket.on('stream', function(stream) {
    console.log("server receiving stream");
    socket.broadcast.emit("stream", stream);
  });
socket.on('disconnect', function () {
    console.log("user disconnected");
  });
});
