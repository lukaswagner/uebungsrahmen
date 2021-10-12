'use strict';

exports.command = ['import', 'im', 'in'];
exports.description = 'Imports an archive.';
exports.handler = require('../handlers/import');
exports.builder = (yargs) => {
    yargs
        .option('input', require('../options/input'))
        .option('mode', require('../options/importMode'))
        .option('assumeYes', require('../options/assumeYes'))
        .option('resetAssignment', require('../options/resetAssignment'))
        .config('config');
};
