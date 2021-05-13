const {app, BrowserWindow} = require('electron');
let mainWindow;

app.on('ready', async () => {
    mainWindow = new BrowserWindow({
        height: 600,
        width: 800,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            devTools: true
        }
    });

    await mainWindow.loadURL('file://' + __dirname + '/index.html');
});

