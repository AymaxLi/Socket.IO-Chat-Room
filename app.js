const express = require('express')
const http = require('http')
const socket = require('socket.io')
const path = require('path')
// const readline = require('readline')
const fs = require('fs')

// const rl = readline.createInterface({
//   input: process.stdin,
//   output: process.stdout
// })

var app = express()
var server = http.createServer(app)
var io = socket.listen(server)
var indexPath = path.resolve(__dirname, 'src/index.html')
var logPath = path.resolve(__dirname, 'log.txt')
var userSet = new Set()

server.listen(819)

app.use(express.static('src'))

app.get('/', function (req, res) {
  res.sendFile(indexPath)
})

io.sockets.on('connection', function (socket) {
  // 缓存 clientIP 不然关闭窗口的时候拿不到
  var clientIP = socket.client.conn.remoteAddress.toString();
  loginHandle(socket, clientIP)
  logoutHandle(socket, clientIP)
})

function loginHandle(socket, clientIP) {
  addUser(socket, clientIP)
  socket.on('clientMsg', function (data) {
    var msg = new Buffer([socket.client.conn.remoteAddress, data.date, data.name, data.text, '\r\n'].join(' '))
    fs.appendFile(logPath, msg, function () {
      socket.broadcast.emit('serverMsg', data)
    })
  })
}

function logoutHandle(socket, clientIP) {
  socket.on('disconnect', function () {
    deleteUser(socket, clientIP)
  })
}

function addUser(socket, clientIP) {
  userSet.add(clientIP)
  socket.emit('curUserCount', {number: userSet.size})
  socket.broadcast.emit('curUserCount', {number: userSet.size})
  console.log(clientIP + ' join ' + 'curUser:' + userSet.size)
}

function deleteUser(socket, clientIP) {
  userSet.delete(clientIP)
  socket.emit('curUserCount', {number: userSet.size})
  socket.broadcast.emit('curUserCount', {number: userSet.size})
  console.log(clientIP + ' logout ' + 'curUser:' + userSet.size)
}
// function sendMessage(socket) {
//  rl.on('line', function (inputText) {
//    socket.emit('serverMsg', {
//      text: inputText,
//      date: new Date().toLocaleString()
//    })
//  })
// }

// var count = 0
// function grow(socket) {
//   setTimeout(function () {
//     socket.emit('serverMsg', { text: count++ })
//     grow(socket)
//   }, 100)
// }
