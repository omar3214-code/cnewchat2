console.log("loaded");
var socket = io();
var local = document.getElementById("local_video");
var remote = document.getElementById("remote_video");
var call = document.getElementById("call");
var end = document.getElementById("end");

var localStream = null, remoteStream = null;

function getUserMedia(callback) {
  navigator.mediaDevices.getUserMedia({video: true, audio: false}).then(
    function(stream) {
      callback(stream);
      return stream;
    }).catch(function(err){
    console.log(err);
  });
}

function displayLocalVideo(stream) {
  localStream = stream;
  local.src = window.URL.createObjectURL(stream);
  local.play();
}

function displayRemoteVideo(stream) {
  remoteStream = stream;
  console.log("remote stream info: " + stream);
  remote.src = window.URL.createObjectURL(stream);
  remote.play();
}

function sendStream(stream) {
  socket.emit("stream", stream);
}

// receiving stream
socket.on("stream", function(stream){
  console.log("receiving data: " + stream);
  displayRemoteVideo(stream);
  if(localStream === null)
    getUserMedia(displayLocalVideo);
});

function getBinaryData(stream) {
  var bd = [];
  bd.push(stream);
  return bd;
}

function getBlob(bd) {
  return new Blob(bd, {type: "application/zip"});
}
