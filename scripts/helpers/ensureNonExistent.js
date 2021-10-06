'use strict';

const fs = require('fs');
const log = require('./log');

/**
 * Checks is a given target exists.
 * @param {import('../types').ArgF} argv Config.
 * @param {string} file The target to check.
 * @returns {boolean} True if the target does not exist
 * (or --force was specified).
 */
function ensureNonExistent(argv, file) {
    let result = !fs.existsSync(file);
    result |= argv.force;
    if (!result) log.error(file, 'already exists!');
    return result;
}

module.exports = ensureNonExistent;
