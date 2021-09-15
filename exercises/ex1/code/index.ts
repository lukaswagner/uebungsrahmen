import 'fw/style/katexLeft.css';

const canvas = document.getElementById('content') as HTMLCanvasElement;
const ctx = canvas.getContext('2d');
ctx.fillStyle = 'white';
ctx.fillRect(0, 0, canvas.width, canvas.height);
ctx.fillStyle = 'black';
ctx.font = '50px monospace';
ctx.fillText('i am a', 10, 75);
ctx.fillText('canvas', 10, 125);
