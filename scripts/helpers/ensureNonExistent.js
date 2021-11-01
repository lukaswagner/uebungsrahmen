'use strict';

const fs = require('fs');
const askYesNo = require('./askYesNo');
const log = require('./log');

/**
 * Checks is a given target exists.
 * @param {import('../types').ArgF} argv Config.
 * @param {string} file The target to check.
 * @returns {boolean} True if the target does not exist
 * (or --force was specified).
 */
async function ensureNonExistent(argv, file) {
    const existing = fs.existsSync(file);
    if (!existing) return true;
    return await askYesNo(argv, `${file} already exists! Overwrite?`, true);
}

module.exports = ensureNonExistent;
