import '../style/ui.css';

import { Button, SelectInput, UI } from '@lukaswagner/web-ui';

import Convert  from 'ansi-to-html';
import { IpcRendererEvent } from 'electron';
import { toggle } from './toggle';

const { ipcRenderer: ipc } = window.require( 'electron');

type Elements = {
    config?: SelectInput,
    commandStop?: Button,
    consoleContainer?: HTMLDivElement,
    console?: HTMLDivElement
}
const elements: Elements = {};

window.onload = () => {
    const config = new UI(document.getElementById('config'));
    elements.config = config.input.select({
        label: 'Configuration'
    });

    const start = new UI(document.getElementById('start'));
    const open = start.input.checkbox({
        label: 'Open page in browser',
        value: true
    });
    start.input.button({
        text: 'Start',
        handler: () => ipc.send('start', {
            config: elements.config.value,
            open: open.value
        })
    });

    const command = new UI(document.getElementById('command'));
    elements.commandStop = command.input.button({
        label: 'None',
        text: 'Stop',
        handler: () => ipc.send('stop', elements.config.value)
    });

    elements.consoleContainer =
        document.getElementById('console-container') as HTMLDivElement;
    elements.console =
        document.getElementById('console') as HTMLDivElement;

    toggle('start', 'start-toggle', true);

    ipc.send('ready');
};

ipc.on('configurations', (
    event: IpcRendererEvent, arg: {configs: string[], config: string}
) => {
    elements.config.values = arg.configs;
    elements.config.value = arg.config;
});

ipc.on('command', (event: IpcRendererEvent, args: string) => {
    elements.commandStop.label.textContent = args;
    if (args !== 'None') elements.console.innerHTML = '';
});

const convert = new Convert({ newline: true, stream: true });
ipc.on('console', (event: IpcRendererEvent, args: string) => {
    elements.console.innerHTML += convert.toHtml(args);
    elements.consoleContainer.scrollTop =
        elements.consoleContainer.scrollHeight;
});
