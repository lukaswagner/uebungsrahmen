'use strict';

exports.command = ['test', 't'];
exports.description = 'Tests functionality.';
exports.handler = require('../handlers/test.js');
exports.builder = (yargs) => {
    yargs
        .option('force', require('../options/force'));
};
