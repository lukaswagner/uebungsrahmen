'use strict';

const defines = require('../../defines.json');

module.exports = {
    alias: ['i'],
    description:
        'Archive file to import.' +
        'Passing a directory chooses the newest file in it.',
    type: 'string',
    default: defines.importDir
};
