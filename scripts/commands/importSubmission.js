'use strict';

const importArchive = require('../handlers/import.js');

exports.command = ['importSubmission', 'is'];
exports.description = 'Alias for "import --mode submission"';
exports.handler = (argv) =>
    importArchive(Object.assign({ mode: 'submission' }, argv));
exports.builder = (yargs) => {
    yargs
        .option('input', require('../options/input'))
        .option('assumeYes', require('../options/assumeYes'))
        .option('resetAssignment', require('../options/resetAssignment'))
        .config('config');
};
