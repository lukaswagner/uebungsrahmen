const canvas = document.getElementById('content') as HTMLCanvasElement;
const ctx = canvas.getContext('2d');
ctx.font = '50px monospace';
ctx.fillText('i am a', 10, 75);
ctx.fillText('canvas', 10, 125);
