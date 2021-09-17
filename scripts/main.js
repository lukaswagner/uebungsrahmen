'use strict';

const yargs = require('yargs');

yargs
    .option('assumeYes', {
        alias: ['y', 'yes'],
        desc: 'Automatic yes to prompts.',
        requiresArg: false,
        type: 'boolean'
    })
    .option('force', {
        alias: ['f'],
        desc: 'Force execution despite failing checks. Use with caution.',
        requiresArg: false,
        type: 'boolean'
    })
    .demandCommand(1, 'You need specify a command.')
    .locale('en')
    .help()
    .wrap(null)
    .argv;
