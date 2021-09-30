'use strict';

const importArchive = require('../handlers/import.js');

exports.command = ['import-solution', 'is'];
exports.description = 'Alias for "import --mode solution"';
exports.handler = (argv) =>
    importArchive(Object.assign({ mode: 'solution' }, argv));
