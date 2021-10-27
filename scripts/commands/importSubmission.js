'use strict';

const json = require('../helpers/json');

exports.command = ['importSubmission', 'is'];
exports.description = 'Alias for "import --mode submission"';
exports.handler = (argv) =>
    require('../handlers/import.js')(
        Object.assign({ mode: 'submission' }, argv, json.read(argv.config)));
exports.builder = (yargs) => {
    yargs
        .option('input', require('../options/input'))
        .option('assumeYes', require('../options/assumeYes'))
        .option('resetAssignment', require('../options/resetAssignment'));
};
