'use strict';

const fs = require('fs');

/**
 * Lists directory entries, ignoring system files.
 * @param {string} dir Directory whose content should be read.
 * @returns {fs.Dirent[]} Contained entries.
 */
function readDirWithoutSystemFiles(dir) {
    const contents = fs.readdirSync(dir, { withFileTypes: true });

    // ignore all files starting with ., e.g. .DS_Store
    const dotFiles = (f) => !f.startsWith('.');
    // ignore windows explorer display settings
    const desktop = (f) => f !== 'desktop.ini';

    const checks = [
        desktop, dotFiles
    ];

    return contents.filter((entry) => {
        const fileName = entry.name;
        return checks.every((c) => c(fileName));
    });
}

module.exports = readDirWithoutSystemFiles;
