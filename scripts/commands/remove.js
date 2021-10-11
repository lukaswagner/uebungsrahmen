'use strict';

const exportArchive = require('../handlers/export.js');

exports.command = ['remove', 'rm'];
exports.description =
    'Removes an assignment.' +
    'If no assignment is specified, the whole assignment setup is removed.';
exports.handler = require('../handlers/remove.js');
exports.builder = (yargs) => {
    yargs
        .option('assumeYes', require('../options/assumeYes'))
        .option('assignment', require('../options/assignment'))
        .option('complete', {
            description:
                'Removes the whole assignment setup, including both the ' +
                'exercise directory as well as the config file. ' +
                'Use with caution, as this will delete all exercises.',
            type: 'boolean'
        })
        .config('config');
};
