// electron/main.js update karein
import { app, BrowserWindow } from "electron"
import path from "path";

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  // Load index.html
  mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
}

app.whenReady().then(createWindow);