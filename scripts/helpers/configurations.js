'use strict';

const fs = require('fs');
const path = require('path');
const json = require('./json');

const confsPath = './configurations.json';

const confs = fs.existsSync(confsPath) ?
    json.read(confsPath) :
    ['./example.json'];

function getIndex(conf) {
    const normConf = path.normalize(path.join(process.cwd(), conf));
    confs.findIndex((c) => {
        const normC = path.normalize(path.join(process.cwd(), c));
        return normC === normConf;
    });
}

function getAll() {
    return confs.slice();
}

function getMostRecent() {
    return confs[0];
}

function setMostRecent(conf) {
    const index = getIndex(conf);
    let elem = conf;
    if (index > -1) elem = confs.splice(index, 1)[0];
    confs.unshift(elem);
    json.write(confsPath, confs);
}

module.exports = {
    getAll,
    getMostRecent,
    setMostRecent
};
