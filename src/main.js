const {app, BrowserWindow, dialog} = require('electron');
let mainWindow;


app.on('ready', async () => {
    mainWindow = new BrowserWindow({
        height: 800,
        width: 1200,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true,
            devTools: true
        }
    });

    await mainWindow.loadURL('file://' + __dirname + '/index.html');
});
