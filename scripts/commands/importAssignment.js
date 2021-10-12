'use strict';

const importArchive = require('../handlers/import.js');

exports.command = ['importAssignment', 'ia'];
exports.description = 'Alias for "import --mode assignment"';
exports.handler = (argv) =>
    importArchive(Object.assign({ mode: 'assignment' }, argv));
exports.builder = (yargs) => {
    yargs
        .option('input', require('../options/input'))
        .option('assumeYes', require('../options/assumeYes'))
        .option('force', require('../options/force'))
        .config('config');
};
