'use strict';

module.exports = {
    alias: ['m'],
    description: 'Import mode. Used to check file integrity.',
    type: 'string',
    choices: ['assignment', 'submission'],
    default: 'assignment'
};
