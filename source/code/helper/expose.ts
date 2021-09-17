import {
    Canvas,
    Context,
    Controller,
    Renderer,
} from 'webgl-operate';

declare global {
    interface Window {
        canvas: Canvas
        context: Context
        controller: Controller
        renderer: Renderer
    }
}

export function expose(canvas: Canvas): void {
    window.canvas = canvas;
    window.context = canvas.context;
    window.controller = canvas.controller;
    window.renderer = canvas.renderer;
}
