'use strict';

const yargs = require('yargs');
const log = require('./helpers/log');
const { checkVersions } = require('./helpers/version');

if (!checkVersions()) {
    log.error('Aborting.');
    process.exit(1);
}

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
