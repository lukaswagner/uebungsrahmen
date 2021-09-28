'use strict';

exports.command = ['run <command>', 'r'];
exports.description = 'Runs the given npm script with correct env settings.';
exports.handler = require('../handlers/run.js');
exports.builder = (yargs) => {
    yargs
        .positional('command', {
            description: 'Script found in scripts section of package.json.',
            demandOption: true,
            type: 'string'
        });
};

