'use strict';

const fs = require('fs');
const path = require('path');
const readDirWithoutSystemFiles = require('./readDirWithoutSystemFiles');

/**
 * Chooses the newest file in a directory.
 * @param {string} dir The directory to search.
 * @param {(fs.Dirent) => void} filter Function to filter directory entries.
 * Only entries who pass this function will be considered.
 * @returns {string?} The newest file in the directory, or undefined if the dir
 * does not contain any valid file.
 */
function findNewestFile(dir, filter) {
    return readDirWithoutSystemFiles(dir)
        .filter((e) => e.isFile() && (!filter || filter(e)))
        .map((e) => {
            const p = path.join(dir, e.name);
            return { p, t: fs.statSync(p).mtime };
        })
        .sort((a, b) => b.t - a.t)
        .map((e) => e.p)[0];
}

module.exports = findNewestFile;
