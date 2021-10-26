'use strict';

const { app, BrowserWindow, ipcMain: ipc } = require('electron');

const json = require('../scripts/helpers/json');
const configurations = require('../scripts/helpers/configurations');

const configs = configurations.getAll();
let config = configurations.getMostRecent();

function createWindow() {
    const window = new BrowserWindow({
    });

    window.loadFile('./build/index.html');
}

app.whenReady().then(() => {
    createWindow();
});

ipc.on('ready', (event) => {
    event.sender.send('configurations', { configs, config });
});
