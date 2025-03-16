const { app, BrowserWindow } = require('electron')

let win

app.whenReady().then(() => {
  win = new BrowserWindow({
    width: 600,
    height: 500,
    webPreferences: { nodeIntegration: true }
  })

  win.loadFile('index.html')
})