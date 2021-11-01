'use strict';

const configPath = require('../helpers/configPath');

module.exports = {
    alias: ['c'],
    desc:
        'Config file to use. All config files are stored in ./config.' +
        'Allows to re-use the framework for multiple lectures.',
    type: 'string',
    default: 'config',
    coerce: configPath
};
