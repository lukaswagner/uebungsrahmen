'use strict';

const json = require('../helpers/json');

exports.command = ['resetAssignment', 'reset', 're'];
exports.description = 'Resets an assignment.';
exports.handler = (argv) => require('../handlers/reset')(
    Object.assign(argv, json.read(argv.config)));
exports.builder = (yargs) => {
    yargs
        .option('assumeYes', require('../options/assumeYes'))
        .option('assignment', require('../options/assignment'));
};
