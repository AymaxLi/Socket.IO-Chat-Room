var host = ''
var socket = io.connect(host)
var userName = document.querySelector('#userName')
var input = document.querySelector('#text')
var ul = document.querySelector('#msgList')
var curUser = document.querySelector('#curUserCount')

document.querySelector('button').onclick = sendMsg
input.addEventListener('keydown', function (e) {
  if(e.keyCode == '13') {
    sendMsg()
    input.value = ''
  }
})

socket.on('serverMsg', function (data) {
  addMsg(data, 1)
})

socket.on('curUserCount', function (data) {
  updateUserCount(data)
})

function sendMsg() {
  if(input.value == '') return
  var data = {
    name: userName.value || '[匿名]',
    text: input.value,
    date: new Date().toLocaleString()
  }
  socket.emit('clientMsg', data)
  addMsg(data, 0)
}

function addMsg(data, type) {
  var li = document.createElement('li')
  li.style.color = type == 0 ? '#f00' : '#000'
  li.innerHTML = '(' + data.date + ')' + data.name + ":<br/>" + data.text
  ul.appendChild(li)
}

function updateUserCount(data) {
  console.log('update count')
  curUser.innerHTML = data.number
}
