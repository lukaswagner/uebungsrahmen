'use strict';

const child = require('child_process');

// subprocess.kill doesn't seem to work properly (at least on windows)
function kill(target) {
    switch (process.platform) {
        case 'win32':
            return child.spawnSync(
                'taskkill', ['/pid', target.pid, '/f', '/t']).status === 0;
        case 'linux':
        case 'darwin':
            // i did not yet test this on unix so use at your own risk i guess
            return child.spawnSync(
                'kill', ['-9', target.pid]).status === 0;
        default:
            console.log('wtf is a', process.platform);
            return false;
    }
}

module.exports = kill;
