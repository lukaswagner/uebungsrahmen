'use strict';

const importArchive = require('../handlers/import.js');

exports.command = ['import-submission', 'is'];
exports.description = 'Alias for "import --mode submission"';
exports.handler = (argv) =>
    importArchive(Object.assign({ mode: 'submission' }, argv));
exports.builder = (yargs) => {
    yargs
        .option('input', require('../options/input'))
        .config('config');
};
