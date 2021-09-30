'use strict';

const exportArchive = require('../handlers/export.js');

exports.command = ['export-solution', 'es'];
exports.description = 'Alias for "export --mode solution"';
exports.handler = (argv) =>
    exportArchive(Object.assign({ mode: 'solution' }, argv));
