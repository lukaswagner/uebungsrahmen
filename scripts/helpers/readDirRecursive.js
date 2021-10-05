'use strict';

const fs = require('fs');
const path = require('path');
const readDirWithoutSystemFiles = require('./readDirWithoutSystemFiles');

function rdrInner(dir, ls) {
    const files = [];
    ls(dir).forEach((e) => {
        const p = path.join(dir, e.name);
        if (e.isDirectory()) files.push(...rdrInner(p, ls));
        else files.push(p);
    });
    return files;
}

/**
 * Recursively lists the files inside a directory.
 * @param {string} dir Directory to read.
 * @param {boolean} excludeSystemFiles Whether system files (desktop.ini,
 * dotfiles) should be excluded from the list.
 */
function readDirRecursive(dir, excludeSystemFiles = true) {
    const ls = excludeSystemFiles ?
        readDirWithoutSystemFiles :
        (dir) => fs.readdirSync(dir, { withFileTypes: true });
    return rdrInner(dir, ls);
}

module.exports = readDirRecursive;
