'use strict';

const exportArchive = require('../handlers/export.js');

exports.command = ['exportSubmission', 'es'];
exports.description = 'Alias for "export --mode submission"';
exports.handler = (argv) =>
    exportArchive(Object.assign({ mode: 'submission' }, argv));
exports.builder = (yargs) => {
    yargs
        .option('output', require('../options/output'))
        .option('assignment', require('../options/assignment'))
        .config('config');
};
