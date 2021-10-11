'use strict';

exports.command = ['run <command>', 'r'];
exports.description =
    'Runs the given npm script with correct env settings. ' +
    'If needed, you can pass additional arguments to the script after --. ' +
    'Example: fw run start -- --no-open';
exports.handler = require('../handlers/run.js');
exports.builder = (yargs) => {
    yargs.positional('command', require('../options/command'));
};

