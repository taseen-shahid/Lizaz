const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 1300,
    height: 900,
    autoHideMenuBar: true,  // hides menu for clean UI
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false
    }
  });

  // Load dashboard.html (your starting page)
  win.loadFile(path.join(__dirname, 'renderer', 'dashboard.html'));
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Quit app completely
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
