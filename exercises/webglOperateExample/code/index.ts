import {
    Canvas,
    Context,
    Controller,
    Initializable,
    Renderer,
} from 'webgl-operate';
import { DemoRenderer } from './renderer';

// for exposing canvas, controller, context, and renderer
declare global {
    interface Window {
        canvas: Canvas
        context: Context
        controller: Controller
        renderer: Renderer
    }
}

const canvasId = 'content';

const htmlCanvas = document.getElementById(canvasId) as HTMLCanvasElement;
htmlCanvas.addEventListener('dblclick', () => {
    if (document.fullscreenElement) {
        document.exitFullscreen();
    } else {
        htmlCanvas.requestFullscreen();
    }
});

const options: WebGLContextAttributes = {};
const canvas = new Canvas(htmlCanvas, options);
const renderer = new DemoRenderer();
canvas.renderer = renderer;

window.canvas = canvas;
window.context = canvas.context;
window.controller = canvas.controller;
window.renderer = renderer;
