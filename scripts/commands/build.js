'use strict';

const run = require('../handlers/run.js');

exports.command = ['build', 'b'];
exports.description = 'Alias for "run build"';
exports.handler = (argv) => run(Object.assign({ command: 'build' }, argv));
