'use strict';

const fs = require('fs');
const path = require('path');
const readDirWithoutSystemFiles = require('./readDirWithoutSystemFiles');

function findNewestFile(dir) {
    return readDirWithoutSystemFiles(dir)
        .filter((e) => e.isFile())
        .map((e) => {
            const p = path.join(dir, e.name);
            return { p, t: fs.statSync(p).mtime };
        })
        .sort((a, b) => b.t - a.t)
        .map((e) => e.p)[0];
}

module.exports = findNewestFile;
