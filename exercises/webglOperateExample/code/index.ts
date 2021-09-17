import {
    Canvas,
    Context,
    Controller,
    Renderer,
    Color
} from 'webgl-operate';
import { DemoRenderer } from './renderer';

import { UI } from '@lukaswagner/web-ui';
import { addFullscreenCheckbox, setupFullscreen } from 'helper/fullscreen';
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
const ui = new UI(controls);

addFullscreenCheckbox(container, ui);

const setColor = (index: number, color: string) =>
    renderer.setColor(index, Color.hex2rgba(color).slice(0, 3));

const color0 = ui.input.text({
    label: 'First color', type: 'color', value: '#aa0000',
    handler: setColor.bind(undefined, 0)
});
setColor(0, color0.value);

const color1 = ui.input.text({
    label: 'Second color', type: 'color', value: '#0000aa',
    handler: setColor.bind(undefined, 1)
});
setColor(1, color1.value);
