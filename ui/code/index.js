'use strict';

var ipc = require('electron').ipcRenderer;

const configElem = document.getElementById('config');

ipc.on('configurations', (v) => {
    for (const conf of configs) {
        const elem = document.createElement('option');
        elem.value = conf;
        elem.text = conf;
        configElem.appendChild(elem);
    }

    configElem.value = config;
});

ipc.send('ready');
