'use strict';

const run = require('../handlers/run.js');

exports.command = ['start', 'r'];
exports.description = 'Alias for "run start"';
exports.handler = (argv) => run(Object.assign({ command: 'start' }, argv));
