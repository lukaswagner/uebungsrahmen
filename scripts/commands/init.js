'use strict';

exports.command = ['initialize', 'init', 'i'];
exports.description = 'Initializes the framework.';
exports.handler = require('../handlers/init.js');
exports.builder = (yargs) => {
    yargs
        .option('lecture', {
            alias: ['l'],
            description: 'The lecture title.',
            demandOption: true,
            type: 'string'
        })
        .option('directory', {
            alias: ['dir', 'd'],
            description: 'Assignment directory. Will be created if necessary.',
            demandOption: true,
            type: 'string'
        })
        .option('color-theme', {
            alias: ['theme', 't'],
            description: 'Color theme.',
            type: 'string',
            choices: ['dark', 'light'],
            default: 'dark'
        });
};
