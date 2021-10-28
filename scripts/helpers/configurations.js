'use strict';

const fs = require('fs');
const path = require('path');
const json = require('./json');
const defines = require('../../defines.json');

function getConfigurations() {
    return !fs.existsSync(defines.configDir) ? [] :
        fs.readdirSync(defines.configDir).map((f) => path.basename(f, '.json'));
}

function getMostRecent() {
    return fs.existsSync(defines.lastConfigStore) ?
        json.read(defines.lastConfigStore) :
        getConfigurations()[0];
}

function setMostRecent(conf) {
    return json.write(defines.lastConfigStore, path.basename(conf, '.json'));
}

module.exports = {
    getConfigurations,
    getMostRecent,
    setMostRecent
};
