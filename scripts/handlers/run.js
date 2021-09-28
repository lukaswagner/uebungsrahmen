'use strict';

const child = require('child_process');

const run = (argv) => {
    child.spawn('npm run ' + argv.command, {
        stdio: 'inherit',
        shell: true,
        env: Object.assign({ 'fw_config': argv.config }, process.env)
    });
};

module.exports = run;
