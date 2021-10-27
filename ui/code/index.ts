import '../style/ui.css';

const { ipcRenderer: ipc } = window.require( 'electron');

import Convert  from 'ansi-to-html';
import { IpcRendererEvent } from 'electron';

type Elements = {
    config?: HTMLSelectElement,
    command?: HTMLSpanElement,
    console?: HTMLTextAreaElement
}
const elements: Elements = {};

window.onload = () => {
    elements.config =
        document.getElementById('config') as HTMLSelectElement;

    document.getElementById('start')
        .onclick = () => ipc.send('start', elements.config.value);

    document.getElementById('stop')
        .onclick = () => ipc.send('stop', elements.config.value);

    elements.command =
        document.getElementById('command') as HTMLSpanElement;
    elements.console =
        document.getElementById('console') as HTMLTextAreaElement;

    ipc.send('ready');
};

ipc.on('configurations', (
    event: IpcRendererEvent, arg: {configs: string[], config: string}
) => {
    for (const conf of arg.configs) {
        const elem = document.createElement('option');
        elem.value = conf;
        elem.text = conf;
        elements.config.appendChild(elem);
    }

    elements.config.value = arg.config;
});

ipc.on('command', (event: IpcRendererEvent, args: string) => {
    elements.command.textContent = args;
});

const convert = new Convert({ newline: true, stream: true });
ipc.on('console', (event: IpcRendererEvent, args: string) => {
    elements.console.innerHTML += convert.toHtml(args);
});
