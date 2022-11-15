'use strict';

const json = require('../helpers/json.js');

exports.command = ['exportSubmission', 'es'];
exports.description = 'Alias for "export --mode submission"';
exports.handler = (argv) => require('../handlers/export.js')(
    Object.assign({ mode: 'submission' }, argv, json.read(argv.config)));
exports.builder = (yargs) => {
    yargs
        .option('output', require('../options/output'))
        .option('assignment', require('../options/assignment'))
        .option('assumeYes', require('../options/assumeYes'))
        .option('force', require('../options/force'));
};
