'use strict';

const child = require('child_process');

function copyRecursive(src, dst) {
    switch (process.platform) {
        case 'win32':
            child.spawnSync(
                'xcopy',
                [src, dst, '/q', '/s', '/e', '/y'],
                { shell: true, stdio: ['inherit', 'ignore', 'inherit'] });
            break;
        case 'linux':
        case 'darwin':
            child.spawnSync(
                'cp',
                ['-R', src + '/*', dst],
                { shell: true, stdio: 'inherit' });
            break;
        default:
            throw 'Don\'t know how to copy on ' + process.platform;
    }
}

module.exports = copyRecursive;
