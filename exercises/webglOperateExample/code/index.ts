import {
    Canvas,
    Color
} from 'webgl-operate';

import {
    addFullscreenCheckbox,
    setupFullscreen
} from 'helper/fullscreen';

import { DemoRenderer } from './renderer';
import { UI } from '@lukaswagner/web-ui';
import { expose } from 'helper/expose';

const container =
    document.getElementById('content-container') as HTMLDivElement;

setupFullscreen(container);

const htmlCanvas = document.getElementById('content') as HTMLCanvasElement;
const options: WebGLContextAttributes = {};
const canvas = new Canvas(htmlCanvas, options);
const renderer = new DemoRenderer();
canvas.renderer = renderer;

expose(canvas);

const controls = document.getElementById('controls') as HTMLDivElement;
const ui = new UI(controls, true);

addFullscreenCheckbox(container, ui);

ui.input.text({
    label: 'First color', type: 'color', value: '#aa0000',
    handler: (v) => renderer.setColor(0, Color.hex2rgba(v).slice(0, 3))
});

ui.input.text({
    label: 'Second color', type: 'color', value: '#0000aa',
    handler: (v) => renderer.setColor(1, Color.hex2rgba(v).slice(0, 3))
});
