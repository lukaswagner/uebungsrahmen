'use strict';

const child = require('child_process');
const os = require('os');
const { app, BrowserWindow, ipcMain: ipc, dialog } = require('electron');

const configurations = require('../scripts/helpers/configurations');
const kill = require('tree-kill');
const absolutePath = require('../scripts/helpers/absolutePath');

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

function updateConfigs() {
    window.webContents.send('configurations', {
        configs: configurations.getConfigurations(),
        config: configurations.getMostRecent()
    });
}

ipc.on('ready', () => updateConfigs());

/** @type { string } */
let runningCommand;
/** @type { child.ChildProcess } */
let runningProcess;

function run({ args, options, config }) {
    if (runningProcess && runningProcess.exitCode === null) {
        dialog.showMessageBox(window, {
            type: 'warning',
            title: 'Already running',
            message:
                'There is a running process! Wait for it to finish or stop it.'
        });
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
        if (config) {
            configurations.setMostRecent(config);
            updateConfigs();
        }
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

ipc.on('config', (event, data) => {
    configurations.setMostRecent(data);
    updateConfigs();
});

ipc.on('run', (event, data) => {
    run(data);
});

ipc.on('stop', () => {
    kill(runningProcess.pid, (error) => {
        if (error) {
            console.log('Error', error);
            return;
        }
        runningProcess = undefined;
        window.webContents.send('command', 'None');
    });
});

ipc.on('answer', (event, data) => {
    runningProcess.send(data);
});

ipc.handle('select', async (event, data) => {
    const properties = [];
    if (data.includes('d')) properties.push('openDirectory', 'createDirectory');
    if (data.includes('f')) properties.push('openFile');
    const result = await dialog.showOpenDialog({
        defaultPath: process.cwd(),
        properties
    });
    if (result?.canceled) return undefined;
    return result?.filePaths[0];
});

ipc.handle('resolve', (event, data) => {
    return absolutePath(data);
});

ipc.on('alert', (event, data) => dialog.showMessageBox(window, data));
