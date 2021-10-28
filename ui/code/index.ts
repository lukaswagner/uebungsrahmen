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

//#region Entry
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

    toggle('init-container', 'init-toggle');
    toggle('start-container', 'start-toggle', true);
    toggle('import-container', 'import-toggle');
    toggle('export-container', 'export-toggle');

    ipc.send('ready');
};
//#endregion

//#region UI sections
function init(): void {
    const ui = new UI(document.getElementById('init'));
    const config = ui.input.text({
        label: 'Configuration name'
    });
    const dirPlaceholder = 'Choose directory...';
    const directory = ui.input.button({
        label: 'Directory',
        text: dirPlaceholder,
        handler: () => ipc.invoke('selectDir').then((path: string) => {
            const text = !!path && path !== '' ? path : dirPlaceholder;
            directory.elements[0].textContent = text;
        })
    });
    const exists = ui.input.checkbox({
        label: 'Directory contains existing setup (e.g. git repository)',
        value: false
    });
    const lecture = ui.input.text({
        label: 'Lecture'
    });
    const author1 = ui.input.text({
        label: 'Author ID 1'
    });
    const author2 = ui.input.text({
        label: 'Author ID 2'
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
                if (config.value === '') {
                    warn('Please enter a configuration name!');
                    return;
                }
                if (directory.elements[0].textContent === dirPlaceholder) {
                    warn('Please select a directory!');
                    return;
                }
                if (lecture.value === '') {
                    warn('Please enter a lecture name!');
                    return;
                }
                if (author1.value === '' && author2.value === '') {
                    warn('Please enter at least one author!');
                    return;
                }
                args = [
                    'init',
                    '-c', config.value,
                    '-d', directory.elements[0].textContent,
                    '-l', lecture.value,
                    '-t', template.value,
                    '--theme', theme.value,
                    '-a', author1.value
                ];
                if (author1.value !== '') args.push(author1.value);
                if (author2.value !== '') args.push(author2.value);
            }
            ipc.send('run', {
                args
            });
            updateLatestConfig();
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
        handler: () => {
            ipc.send('run', {
                args: [
                    'start',
                    '-c', elements.config.value,
                    '--', open.value ? '--open' : '--no-open'
                ]
            });
            updateLatestConfig();
        }
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
//#endregion

//#region Message handlers
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

ipc.on('question', (event: IpcRendererEvent, data: string) => {
    elements.questionText.textContent = data;
    elements.questionContainer.classList.remove('d-none');
});
//#endregion

//#region Message sending
function updateLatestConfig(): void {
    ipc.send('config', elements.config.value);
}

function answer(a: boolean): void{
    ipc.send('answer', a);
    elements.questionContainer.classList.add('d-none');
}

function warn(message: string, title = 'Warning'): void {
    ipc.send('alert', {
        title,
        message,
        type: 'warning'
    });
}
//#endregion
