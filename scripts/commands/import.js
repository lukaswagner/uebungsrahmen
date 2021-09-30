'use strict';

exports.command = ['import', 'im', 'in'];
exports.description = 'Imports an archive.';
exports.handler = require('../handlers/import');
exports.builder = (yargs) => {
    yargs
        .option('input', {
            alias: ['i'],
            description:
                'Archive file to import. If none is given, ' +
                'this defaults to the newest file in the ./assignment dir. ' +
                'Passing a directory chooses the newest file in it.',
            type: 'array',
        })
        .option('mode', {
            alias: ['m'],
            description: 'Import mode. Used to check file integrity.',
            type: 'string',
            choices: ['assignment', 'solution'],
            default: 'assignment'
        });
};
