'use strict';

exports.command = ['run <command>', 'r'];
exports.description = 'Runs the given npm script with correct env settings.';
exports.handler = require('../handlers/run.js');
exports.builder = (yargs) => {
    yargs.positional('command', require('../options/command'));
};

