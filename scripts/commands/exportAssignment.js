'use strict';

const exportArchive = require('../handlers/export.js');

exports.command = ['export-assignment', 'ea'];
exports.description = 'Alias for "export --mode assignment"';
exports.handler = (argv) =>
    exportArchive(Object.assign({ mode: 'assignment' }, argv));
exports.builder = (yargs) => {
    yargs
        .option('assumeYes', require('../options/assumeYes'))
        .option('output', require('../options/output'))
        .option('assignment', require('../options/assignment'));
};
