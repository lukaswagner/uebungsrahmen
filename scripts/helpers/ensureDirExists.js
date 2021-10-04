'use strict';

const fs = require('fs');

/**
 * Checks if the directory exists and creates it otherwise.
 * @param {string} directory The directory to check/create.
 */
function ensureDirExists(directory, argv) {
    const dir = directory ?? argv.directory;
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
}

module.exports = ensureDirExists;
