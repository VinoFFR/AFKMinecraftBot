const { io } = require('socket.io-client')
const socket = io('http://localhost:3001')

socket.on('connect', () => {
  const statusEl = document.getElementById('connectionStatus')
  statusEl.textContent = "Connected"
  statusEl.classList.remove("disconnected")
  statusEl.classList.add("connected")
})

socket.on('disconnect', () => {
  const statusEl = document.getElementById('connectionStatus')
  statusEl.textContent = "Disconnected"
  statusEl.classList.remove("connected")
  statusEl.classList.add("disconnected")
})

function setupButton(id, direction) {
  const btn = document.getElementById(id)
  btn.addEventListener('mousedown', () => socket.emit('move', { direction, state: true }))
  btn.addEventListener('mouseup', () => socket.emit('move', { direction, state: false }))
}

setupButton('forward', 'forward')
setupButton('backward', 'back')
setupButton('left', 'left')
setupButton('right', 'right')
document.getElementById('jump').addEventListener('click', () => socket.emit('jump'))
document.getElementById('drop').addEventListener('click', () => socket.emit('dropInventory'))

document.getElementById('sendCommand').addEventListener('click', () => {
  const command = document.getElementById('chatCommand').value
  socket.emit('chatCommand', command)
  document.getElementById('chatCommand').value = ''
})

document.getElementById('tpaButton').addEventListener('click', () => {
  const target = document.getElementById('tpaTarget').value.trim()
  if(target) {
    socket.emit('tpa', target)
    document.getElementById('tpaTarget').value = ''
  }
})

document.getElementById('afk1').addEventListener('click', () => socket.emit('afk1'))
document.getElementById('afk2').addEventListener('click', () => socket.emit('afk2'))
document.getElementById('afk3').addEventListener('click', () => socket.emit('afk3'))

document.getElementById('follow').addEventListener('click', () => socket.emit('followNearest'))

document.getElementById('eat').addEventListener('click', () => socket.emit('eat'))
document.getElementById('attack').addEventListener('click', () => socket.emit('attack'))

let currentYaw = 0    
let currentPitch = 0  
const sensitivity = 0.02  

const joystickZone = document.getElementById('joystickZone');
const joystick = nipplejs.create({
  zone: joystickZone,
  mode: 'static',
  position: { left: '50%', top: '50%' },
  color: 'white'
});

joystick.on('move', (evt, data) => {
  if (data.vector) {
    currentYaw -= data.vector.x * sensitivity
    currentPitch += data.vector.y * sensitivity

    if (currentPitch > Math.PI/2) currentPitch = Math.PI/2
    if (currentPitch < -Math.PI/2) currentPitch = -Math.PI/2
    
    socket.emit('rotate', { yaw: currentYaw, pitch: currentPitch })
  }
})

joystick.on('end', () => {
})