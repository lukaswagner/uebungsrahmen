import '../style/ui.css';

import { Button, SelectInput, UI } from '@lukaswagner/web-ui';

import Convert from 'ansi-to-html';
import { IpcRendererEvent } from 'electron';
import { toggle } from './toggle';

const { ipcRenderer: ipc } = window.require( 'electron');

type Elements = {
    config?: SelectInput,
    commandStop?: Button,
    consoleContainer?: HTMLDivElement,
    console?: HTMLDivElement,
    questionContainer?: HTMLDivElement,
    questionText?: HTMLSpanElement
}
const elements: Elements = {};

function init(): void {
    const ui = new UI(document.getElementById('init'));
    const config = ui.input.text({
        label: 'Configuration name'
    });
    const directory = ui.input.text({
        label: 'Directory'
    });
    const exists = ui.input.checkbox({
        label: 'Directory contains existing setup (e.g. git repository)',
        value: false
    });
    const lecture = ui.input.text({
        label: 'Lecture'
    });
    const author1 = ui.input.text({
        label: 'Author 1'
    });
    const author2 = ui.input.text({
        label: 'Author 2 (optional)'
    });
    const template = ui.input.text({
        label: 'Template',
        value: './template'
    });
    const theme = ui.input.select({
        label: 'Theme',
        optionValues: ['dark', 'light'],
        value: 'dark'
    });
    ui.input.button({
        text: 'Initialize',
        handler: () => {
            let args: string[] = [];
            if (exists.value) {
                args = [];
            } else {
                args = [
                    'init',
                    '-c', config.value,
                    '-d', directory.value,
                    '-l', lecture.value,
                    '-a', author1.value,
                    '-t', template.value,
                    '--theme', theme.value
                ];
                if (author2.value !== '') args.push(author2.value);
            }
            ipc.send('run', {
                args
            });
        }
    });
}

function start(): void {
    const ui = new UI(document.getElementById('start'));
    const open = ui.input.checkbox({
        label: 'Open page in browser',
        value: true
    });
    ui.input.button({
        text: 'Start',
        handler: () => ipc.send('run', {
            args: [
                'start',
                '-c', elements.config.value,
                '--', open.value ? '--open' : '--no-open'
            ]
        })
    });
}

function command(): void {
    const ui = new UI(document.getElementById('command'));
    elements.commandStop = ui.input.button({
        label: 'None',
        text: 'Stop',
        handler: () => ipc.send('stop', elements.config.value)
    });
}

window.onload = () => {
    const config = new UI(document.getElementById('config'));
    elements.config = config.input.select({
        label: 'Configuration'
    });

    init();
    start();
    command();

    elements.consoleContainer =
        document.getElementById('console-container') as HTMLDivElement;
    elements.console =
        document.getElementById('console') as HTMLDivElement;
    elements.questionContainer =
        document.getElementById('question-container') as HTMLDivElement;
    elements.questionText =
        document.getElementById('question-text') as HTMLSpanElement;

    (document.getElementById('question-yes') as HTMLButtonElement)
        .onclick = () => answer(true);
    (document.getElementById('question-no') as HTMLButtonElement)
        .onclick = () => answer(false);

    toggle('init', 'init-toggle');
    toggle('start', 'start-toggle', true);

    ipc.send('ready');
};

ipc.on('configurations', (
    event: IpcRendererEvent, data: {configs: string[], config: string}
) => {
    elements.config.values = data.configs;
    elements.config.value = data.config;
});

ipc.on('command', (event: IpcRendererEvent, data: string) => {
    elements.commandStop.label.textContent = data;
    if (data !== 'None') elements.console.innerHTML = '';
});

const convert = new Convert();
ipc.on('console', (event: IpcRendererEvent, data: string[]) => {
    data.forEach((l) =>
        elements.console.innerHTML += convert.toHtml(l) + '<br>');
    elements.consoleContainer.scrollTop =
        elements.consoleContainer.scrollHeight;
});

function answer(a: boolean): void{
    ipc.send('answer', a);
    elements.questionContainer.classList.add('d-none');
}

ipc.on('question', (event: IpcRendererEvent, data: string) => {
    elements.questionText.textContent = data;
    elements.questionContainer.classList.remove('d-none');
});
