'use strict';

const json = require('../helpers/json');

exports.command = ['import', 'im', 'in'];
exports.description = 'Imports an archive.';
exports.handler = (argv) => require('../handlers/import')(
    Object.assign(argv, json.read(argv.config)));
exports.builder = (yargs) => {
    yargs
        .option('input', require('../options/input'))
        .option('mode', require('../options/importMode'))
        .option('assumeYes', require('../options/assumeYes'))
        .option('force', require('../options/force'))
        .option('resetAssignment', require('../options/resetAssignment'));
};
