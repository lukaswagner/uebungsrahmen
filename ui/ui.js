'use strict';

const child = require('child_process');
const os = require('os');
const { app, BrowserWindow, ipcMain: ipc, dialog } = require('electron');

const configurations = require('../scripts/helpers/configurations');
const kill = require('tree-kill');

function createWindow() {
    const window = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });

    window.on('close', (event) => {
        if (fwInstance && fwInstance.exitCode === null) {
            event.preventDefault();
            const result = dialog.showMessageBoxSync(window, {
                message: 'Framework process still running:\n' + fwCommand,
                type: 'warning',
                buttons: ['Stop process', 'Cancel'],
                noLink: true
            });
            if (result === 0) {
                kill(fwInstance.pid, () => window.close());
                fwInstance = undefined;
            }
        }
    });

    window.loadFile('./build/index.html');
}

app.whenReady().then(() => {
    createWindow();
});

ipc.on('ready', (event) => {
    event.sender.send('configurations', {
        configs: configurations.getAll(),
        config: configurations.getMostRecent()
    });
});

const command = os.platform() === 'win32' ? '.\\fw.bat' : './fw.sh';

let fwCommand;
let fwInstance;

function run(cmd, args, options) {
    if (fwInstance && fwInstance.exitCode === null) {
        console.log('Already running!');
        return;
    }
    const command = [cmd, ...args].join(' ');
    console.log('Running command:', command);
    fwCommand = command;
    fwInstance = child.spawn(cmd, args, options);
}

ipc.on('start', (event, args) => {
    console.log('start');
    run(command, [
        'start',
        '--c', args,
        '--', '--no-open'
    ], {
        stdio: 'pipe',
        shell: true,
        encoding: 'utf8'
    });
});

ipc.on('stop', () => {
    kill(fwInstance.pid);
});
