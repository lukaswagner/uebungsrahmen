'use strict';

var ipc = require('electron').ipcRenderer;

let configElem;
let startButton;

window.onload = () => {
    configElem = document.getElementById('config');

    document.getElementById('start')
        .onclick = () => ipc.send('start', configElem.value);

    document.getElementById('stop')
        .onclick = () => ipc.send('stop', configElem.value);

    ipc.send('ready');
};

ipc.on('configurations', (event, arg) => {
    for (const conf of arg.configs) {
        const elem = document.createElement('option');
        elem.value = conf;
        elem.text = conf;
        configElem.appendChild(elem);
    }

    configElem.value = arg.config;
});

