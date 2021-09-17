'use strict';

const fs = require('fs');

/**
 * @param {{directory?: string}} argv
 * @param {string} directory
 */
function ensureDirExists(argv, directory) {
    const dir = directory ?? argv.directory;
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
}

module.exports = ensureDirExists;
