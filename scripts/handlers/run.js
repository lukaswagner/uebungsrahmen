'use strict';

const child = require('child_process');

const run = (argv) => {
    const args = ['run', argv.command, '--silent'];
    const additionalArgs = argv._.slice(1);
    if (additionalArgs.length > 0) {
        args.push('--', ...additionalArgs);
    }
    child.spawn('npm', args, {
        stdio: 'inherit',
        shell: true,
        env: Object.assign({ 'fw_config': argv.config }, process.env)
    });
};

module.exports = run;
