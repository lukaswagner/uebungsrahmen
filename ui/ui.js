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
        width: 800,
        height: 1000,
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
    const newArgs = ['./scripts/main.js', ...args];
    const command = ['node', ...newArgs].join(' ');
    console.log('Running command:', command);
    runningCommand = command;
    runningProcess = child.spawn('node', newArgs, Object.assign({
        stdio: ['ignore', 'pipe', 'pipe', 'ipc'],
        encoding: 'utf8'
    }, options));

    runningProcess.stdout.on('data', sendConsole);
    runningProcess.stderr.on('data', sendConsole);

    runningProcess.on('exit', () => {
        window.webContents.send('command', 'None');
    });

    runningProcess.on('message', (question) => {
        window.webContents.send('question', question);
    });

    window.webContents.send('command', runningCommand);
}

function sendConsole(data) {
    const split = data.toString().split('\n');
    const lines = split.map((s) => s.trim()).filter((s) => s.length > 0);
    window.webContents.send('console', lines);
}

ipc.on('run', (event, data) => {
    run(command, data.args, data.options);
});

ipc.on('stop', () => {
    kill(runningProcess.pid);
    window.webContents.send('command', 'None');
});

ipc.on('answer', (event, data) => {
    runningProcess.send(data);
});
