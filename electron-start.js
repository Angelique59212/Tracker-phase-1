const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const remote = require('@electron/remote/main');

// Create the Browser Window and load the main html entry point.
const makeWindow = () => {
    const win = new BrowserWindow({
        width: 1200,
        height: 600,
        center: true,
        title: "CTrack",
        icon: path.resolve(__dirname + "/assets/icon.png"),
        autoHideMenuBar: true,
        webPreferences: {
            nodeIntegration:true, //autorise l'intégration node
            contextIsolation:false, //désactive l'isolation du main et des renders
            //enableRemoteModule: true,
        }
    })

    remote.initialize();
    remote.enable(win.webContents);
    win.webContents.openDevTools();
    win.loadFile('src/index.html');
};

// Create app when electron is ready.
app.whenReady().then(() => {
    makeWindow();
    // On MacOs, if app window does not exists, then create on 'activate' event.
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            makeWindow()
        }
    })
});

// Closing app if all windows are closed BUT MacOs.
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
});

ipcMain.on('log-error', (event,arg) => {
    if ('type' in arg && 'message' in arg) {
        console.table(arg);
        console.error(`Erreur -> Type: ${arg.type} => message: ${arg.message}`);
        event.sender.send('log-error-reply', 'Error was logged')
    }
    else {
        console.log('Une erreur inconnu a été reporté par un des Render process');
    }
})
