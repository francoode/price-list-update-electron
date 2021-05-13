const {app, BrowserWindow} = require('electron');
let mainWindow;

app.on('ready', async () => {
    mainWindow = new BrowserWindow({
        height: 800,
        width: 1000,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            devTools: true
        }
    });

    await mainWindow.loadURL('file://' + __dirname + '/index.html');
});

