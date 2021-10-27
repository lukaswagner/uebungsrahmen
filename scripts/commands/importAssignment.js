'use strict';

const json = require('../helpers/json.js');

exports.command = ['importAssignment', 'ia'];
exports.description = 'Alias for "import --mode assignment"';
exports.handler = (argv) =>
    require('../handlers/import.js')(
        Object.assign({ mode: 'assignment' }, argv, json.read(argv.config)));
exports.builder = (yargs) => {
    yargs
        .option('input', require('../options/input'))
        .option('assumeYes', require('../options/assumeYes'))
        .option('force', require('../options/force'));
};
