'use strict';

const fs = require('fs');
const findNewestFile = require('./findNewestFile');

function chooseArchive(path) {
    const exists = !!path && fs.existsSync(path);
    if (!exists) return undefined;

    const stat = fs.statSync(path);
    if (stat.isFile()) return path;
    else if (stat.isDirectory()) return findNewestFile(path);

    return undefined;
}

module.exports = chooseArchive;
