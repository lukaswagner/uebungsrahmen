'use strict';

const child = require('child_process');

function runNpm(args, options) {
    child.spawnSync(
        'npm',
        args,
        Object.assign({ shell: true, stdio: 'inherit' }, options));
}

module.exports = runNpm;
