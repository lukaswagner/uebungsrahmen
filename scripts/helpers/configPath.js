'use strict';

const path = require('path');
const defines = require('../../defines.json');

function configPath(conf) {
    return '.' + path.sep + path.join(defines.configDir, conf + '.json');
}

module.exports = configPath;
