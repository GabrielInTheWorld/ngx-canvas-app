import { app, BrowserWindow, Menu, screen } from 'electron';
import * as path from 'path';
import * as fs from 'fs';
import * as url from 'url';
import { WindowManager } from './infrastructure/window-manager';
import { createMenu } from './infrastructure/menu-manager';

// installing auto-updater
require(`update-electron-app`)();

let win: BrowserWindow | null = null;
const args = process.argv.slice(1),
    serve = args.some(val => val === '--serve');

function createWindow(): BrowserWindow {
    const electronScreen = screen;
    const size = electronScreen.getPrimaryDisplay().workAreaSize;

    // Create the browser window.
    win = new BrowserWindow({
        x: 0,
        y: 0,
        width: size.width,
        height: size.height,
        webPreferences: {
            nodeIntegration: true,
            allowRunningInsecureContent: serve ? true : false,
            contextIsolation: false // false if you want to run e2e test with Spectron
        }
    });

    if (serve) {
        win.webContents.openDevTools();
        win.loadURL('http://localhost:4200');
    } else {
        // Path when running electron executable
        let pathIndex = './index.html';
        const clientPath = '../frontend/index.html';

        if (fs.existsSync(path.join(__dirname, clientPath))) {
            // Path when running electron in local folder
            pathIndex = clientPath;
        }

        win.loadURL(
            url.format({
                pathname: path.join(__dirname, pathIndex),
                protocol: 'file:',
                slashes: true
            })
        );
    }

    // Emitted when the window is closed.
    win.on('closed', () => {
        // Dereference the window object, usually you would store window
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        win = null;
    });

    return win;
}

// function sendStatusToWindow(message: string): void {
//     win?.webContents.send(`message`, message);
// }

// autoUpdater.on('checking-for-update', () => {
//     sendStatusToWindow('Checking for update...');
// });
// autoUpdater.on('update-available', () => {
//     sendStatusToWindow('Update available.');
// });
// autoUpdater.on('update-not-available', () => {
//     sendStatusToWindow('Update not available.');
// });
// autoUpdater.on('error', err => {
//     sendStatusToWindow('Error in auto-updater. ' + err);
// });
// autoUpdater.on('download-progress', progressObj => {
//     let log_message = 'Download speed: ' + progressObj.bytesPerSecond;
//     log_message = log_message + ' - Downloaded ' + progressObj.percent + '%';
//     log_message = log_message + ' (' + progressObj.transferred + '/' + progressObj.total + ')';
//     sendStatusToWindow(log_message);
// });
// autoUpdater.on('update-downloaded', info => {
//     sendStatusToWindow('Update downloaded');
// });

try {
    // This method will be called when Electron has finished
    // initialization and is ready to create browser windows.
    // Some APIs can only be used after this event occurs.
    // Added 400 ms to fix the black background issue while using transparent window. More detais at https://github.com/electron/electron/issues/15947
    app.on('ready', () =>
        setTimeout(() => {
            // Create menu and set it
            Menu.setApplicationMenu(createMenu());

            // autoUpdater.checkForUpdates();

            WindowManager.addWindow(createWindow());
        }, 400)
    );

    // Quit when all windows are closed.
    app.on('window-all-closed', () => {
        // On OS X it is common for applications and their menu bar
        // to stay active until the user quits explicitly with Cmd + Q
        if (process.platform !== 'darwin') {
            app.quit();
        }
    });
    app.on('activate', () => {
        // On OS X it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.

        if (win === null) {
            WindowManager.addWindow(createWindow());
        }
    });
} catch (e) {
    // Catch Error
    // throw e;
}

// ipcMain.handle(`hello`, (event, args) => {
//     console.log(`got on ipcMain`, args);
// });
