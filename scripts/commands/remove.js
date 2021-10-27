'use strict';

const json = require('../helpers/json');

exports.command = ['remove', 'rm'];
exports.description =
    'Removes an assignment.' +
    'If no assignment is specified, the whole assignment setup is removed.';
exports.handler = (argv) =>
    require('../handlers/remove.js')(
        Object.assign(argv, json.read(argv.config)));
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
        });
};
