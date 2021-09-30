'use strict';

module.exports = {
    alias: ['o'],
    description:
        'Archive file to create. ' +
        'Passing a directory auto-generates a filename.',
    type: 'string',
    default: defines.exportDir
};
