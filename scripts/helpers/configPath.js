'use strict';

const path = require('path');
const defines = require('../../defines.json');

function configPath(conf) {
    const cleaned = path.basename(conf, '.json');
    return '.' + path.sep + path.join(defines.configDir, cleaned + '.json');
}

module.exports = configPath;
