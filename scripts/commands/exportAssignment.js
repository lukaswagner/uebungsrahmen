'use strict';

const json = require('../helpers/json.js');

exports.command = ['exportAssignment', 'ea'];
exports.description = 'Alias for "export --mode assignment"';
exports.handler = (argv) => require('../handlers/export.js')(
    Object.assign({ mode: 'assignment' }, argv, json.read(argv.config)));
exports.builder = (yargs) => {
    yargs
        .option('assumeYes', require('../options/assumeYes'))
        .option('force', require('../options/force'))
        .option('output', require('../options/output'))
        .option('assignment', require('../options/assignment'))
        .option('remove', require('../options/remove'));
};
