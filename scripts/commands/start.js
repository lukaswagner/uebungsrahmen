'use strict';

const run = require('../handlers/run.js');

exports.command = ['start', 's'];
exports.description = 'Alias for "run start"';
exports.handler = (argv) => run(Object.assign({ command: 'start' }, argv));
