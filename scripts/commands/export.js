'use strict';

exports.command = ['export', 'ex', 'out'];
exports.description = 'Exports an archive.';
exports.handler = require('../handlers/export');
exports.builder = (yargs) => {
    yargs
        .option('output', require('../options/output'))
        .option('assignment', require('../options/assignment'))
        .option('mode', require('../options/exportMode'))
        .option('assumeYes', require('../options/assumeYes'))
        .option('force', require('../options/force'))
        .config('config');
};
