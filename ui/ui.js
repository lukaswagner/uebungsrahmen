'use strict';

const child = require('child_process');
const os = require('os');
const { app, BrowserWindow, ipcMain: ipc, dialog } = require('electron');

const configurations = require('../scripts/helpers/configurations');
const kill = require('tree-kill');

/** @type { BrowserWindow } */
let window;
function createWindow() {
    window = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });

    window.on('close', (event) => {
        if (runningProcess && runningProcess.exitCode === null) {
            event.preventDefault();
            const result = dialog.showMessageBoxSync(window, {
                message: 'Framework process still running:\n' + runningCommand,
                type: 'warning',
                buttons: ['Stop process', 'Cancel'],
                noLink: true
            });
            if (result === 0) {
                kill(runningProcess.pid, () => window.close());
                runningProcess = undefined;
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

/** @type { string } */
let runningCommand;
/** @type { child.ChildProcess } */
let runningProcess;

function run(cmd, args, options) {
    if (runningProcess && runningProcess.exitCode === null) {
        console.log('Already running!');
        return;
    }
    const command = [cmd, ...args].join(' ');
    console.log('Running command:', command);
    runningCommand = command;
    runningProcess = child.spawn(cmd, args, Object.assign({
        stdio: 'pipe',
        shell: true,
        encoding: 'utf8'
    }, options));

    runningProcess.stdout.on('data', (data) => {
        window.webContents.send('console', data.toString());
    });

    runningProcess.stderr.on('data', (data) => {
        window.webContents.send('console', data.toString());
    });

    runningProcess.on('exit', () => {
        window.webContents.send('command', 'None');
    });

    window.webContents.send('command', runningCommand);
}

ipc.on('start', (event, args) => {
    console.log('start');
    run(command, [
        'start',
        '--c', args,
        '--', '--no-open'
    ]);
});

ipc.on('stop', () => {
    kill(runningProcess.pid);
    window.webContents.send('command', 'None');
});
