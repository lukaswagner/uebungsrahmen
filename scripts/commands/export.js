'use strict';

const json = require('../helpers/json');

exports.command = ['export', 'ex', 'out'];
exports.description = 'Exports an archive.';
exports.handler = (argv) => require('../handlers/export')(
    Object.assign(argv, json.read(argv.config)));
exports.builder = (yargs) => {
    yargs
        .option('output', require('../options/output'))
        .option('assignment', require('../options/assignment'))
        .option('mode', require('../options/exportMode'))
        .option('assumeYes', require('../options/assumeYes'))
        .option('force', require('../options/force'))
        .option('remove', require('../options/remove'));
};
