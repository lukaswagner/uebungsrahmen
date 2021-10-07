// eslint-disable-next-line max-len
// https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Tutorial/Getting_started_with_WebGL

function main(): void {
    const canvas = document.querySelector('#content') as HTMLCanvasElement;
    // Initialize the GL context
    const gl = canvas.getContext('webgl');

    // Only continue if WebGL is available and working
    if (gl === null) {
        alert(
            'Unable to initialize WebGL. ' +
            'Your browser or machine may not support it.');
        return;
    }

    // Set clear color to black, fully opaque
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    // Clear the color buffer with specified clear color
    gl.clear(gl.COLOR_BUFFER_BIT);
}

window.onload = main;
