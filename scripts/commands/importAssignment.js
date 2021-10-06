'use strict';

const importArchive = require('../handlers/import.js');

exports.command = ['import-assignment', 'ia'];
exports.description = 'Alias for "import --mode assignment"';
exports.handler = (argv) =>
    importArchive(Object.assign({ mode: 'assignment' }, argv));
exports.builder = (yargs) => {
    yargs
        .option('input', require('../options/input'))
        .option('assumeYes', require('../options/assumeYes'))
        .config('config');
};
