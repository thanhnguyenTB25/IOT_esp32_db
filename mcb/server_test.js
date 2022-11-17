// var express = require('express')  // Module xử lí chung
// var mysql = require('mysql')     // Module cho phép sử dụng cơ sở dữ liệu mySQL 
// var mqtt = require('mqtt')        // Module cho phép sử dụng giao thức mqtt
// var port = 3123

// var io = require('socket.io')(server)
// var app = express()

// var server = require("http").Server(app)



// app.use(express.static("./public"))
// app.set("views engine", "ejs")
// app.set("views", "./views")



const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);


app.use(express.static("public"))
app.set("views", "./views")

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/views/trangchu.html')
})
var port = 3456;
server.listen(port, function () {
    console.log('Server listening on port ' + port)
})

io.on("connection", function (socket) {
    console.log("Vua them nguoi dung truy cap");
})

io.sockets.emit("topic", "Dữ liệu nè In ra đi");

// app.get('/', function (req, res) {
//     res.render('trangchu.ejs')
// })