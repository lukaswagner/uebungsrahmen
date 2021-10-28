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
    toggle('start-container', 'start-toggle');
    toggle('import-container', 'import-toggle');
    toggle('export-container', 'export-toggle');

    ipc.send('ready');
};
//#endregion

//#region UI sections
function makeSubmit(
    form: HTMLFormElement, button: Button, func: () => void
): void {
    button.container.classList.add('c-span');
    button.elements[0].type = 'submit';
    form.onsubmit = () => {
        func();
        return false;
    };
}

function addHelp(label: HTMLLabelElement, text: string): void {
    label.classList.add('help');
    label.title = text;
}

function init(): void {
    const form = document.getElementById('init') as HTMLFormElement;
    const ui = new UI(form);
    const config = ui.input.text({
        label: 'Configuration name'
    });
    const lecture = ui.input.text({
        label: 'Lecture title'
    });
    let dir: string;
    const dirPlaceholder = 'Choose directory...';
    const directory = ui.input.button({
        label: 'Directory',
        text: dirPlaceholder,
        handler: () => ipc.invoke('selectDir').then((path: string) => {
            dir = path;
            const text = !!dir && dir !== '' ? dir : dirPlaceholder;
            directory.elements[0].innerHTML = `<span>${text}</span>`;
            directory.elements[0].title = text;
        })
    });
    const exists = ui.input.checkbox({
        label: 'Dir contains existing setup',
        value: false
    });
    addHelp(exists.label, 'Check this e.g. when adding a git repo.');
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

    const init = (): void => {
        if (config.value === '') {
            warn('Please enter a configuration name!');
            return;
        }
        if (dir === dirPlaceholder) {
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
        const args = [
            'init',
            '-c', config.value,
            '-d', dir,
            '-l', lecture.value,
            '-t', template.value,
            '--theme', theme.value,
            '-a'
        ];
        if (author1.value !== '') args.push(author1.value);
        if (author2.value !== '') args.push(author2.value);
        if (exists.value) args.push('-e');
        ipc.send('run', {
            args
        });
        updateLatestConfig();
    };

    const button = ui.input.button({
        text: 'Initialize'
    });
    makeSubmit(form, button, init);
}

function start(): void {
    const form = document.getElementById('start') as HTMLFormElement;
    const ui = new UI(form);
    const open = ui.input.checkbox({
        label: 'Open page in browser',
        value: true
    });

    const run = (): void => {
        ipc.send('run', {
            args: [
                'start',
                '-c', elements.config.value,
                '--', open.value ? '--open' : '--no-open'
            ]
        });
        updateLatestConfig();
    };

    form.appendChild(document.createElement('div'));
    const button = ui.input.button({
        text: 'Start'
    });
    makeSubmit(form, button, run);
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
