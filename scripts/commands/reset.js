'use strict';

const exportArchive = require('../handlers/export.js');

exports.command = ['reset', 're'];
exports.description = 'Resets an assignment.';
exports.handler = require('../handlers/reset');
exports.builder = (yargs) => {
    yargs
        .option('assumeYes', require('../options/assumeYes'))
        .option('assignment', require('../options/assignment'))
        .config('config');
};
