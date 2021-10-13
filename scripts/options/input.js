'use strict';

const defines = require('../../defines.json');

module.exports = {
    alias: ['i'],
    description:
        'Archive file to import.' +
        'Passing a directory chooses the newest file in it. ' +
        'When importing assignments, you can specify multiple archives.',
    type: 'array',
    default: [defines.importDir]
};
