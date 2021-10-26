'use strict';

const fs = require('fs');
const path = require('path');
const json = require('./json');

const confsPath = './configurations.json';

const confs = fs.existsSync(confsPath) ?
    json.read(confsPath) :
    ['example'];

function getAll() {
    return confs.slice();
}

function getMostRecent() {
    return confs[0];
}

function setMostRecent(conf) {
    const name = path.basename(conf, '.json');
    const index = confs.findIndex((c) => c === name);
    let elem = name;
    if (index > -1) elem = confs.splice(index, 1)[0];
    confs.unshift(elem);
    json.write(confsPath, confs);
}

module.exports = {
    getAll,
    getMostRecent,
    setMostRecent
};
