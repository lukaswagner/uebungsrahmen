'use strict';

const yargs = require('yargs');

(async () => {
    await yargs
        .option('config', require('./options/config'))
        .commandDir('./commands')
        .demandCommand(1, 'You need specify a command.')
        .scriptName('fw')
        .locale('en')
        .help()
        .alias('help', ['h', 'info'])
        .alias('version', 'v')
        .wrap(null)
        .argv;
})();
