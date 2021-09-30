'use strict';

exports.command = ['export', 'ex', 'out'];
exports.description = 'Exports an archive.';
exports.handler = require('../handlers/export');
exports.builder = (yargs) => {
    yargs
        .option('output', {
            alias: ['o'],
            description:
                'Archive file to create. If none is given, ' +
                'the file is stored in the ./export dir, ' +
                'with a filename based on the exercise. ' +
                'Passing a directory also names the file based on the exercise',
            type: 'string'
        })
        .option('assignment', {
            alias: ['a'],
            description:
                'Assignment to export. If none is given, ' +
                'the most recently imported assignment is chosen.',
            type: 'string'
        })
        .option('mode', {
            alias: ['m'],
            description: 'Export mode.',
            type: 'string',
            choices: ['assignment', 'solution'],
            default: 'solution'
        });
};
