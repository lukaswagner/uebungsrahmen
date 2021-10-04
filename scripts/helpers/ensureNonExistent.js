'use strict';

const fs = require('fs');

/**
 * Checks is a given target exists.
 * @param {import('../types').ArgF} argv Command line args.
 * @param {string} file The target to check.
 * @returns {boolean} True if the target does not exist
 * (or --force was specified).
 */
function ensureNonExistent(argv, file) {
    let result = !fs.existsSync(file);
    result |= argv.force;
    if (!result) console.error(file, 'already exists!');
    return result;
}

module.exports = ensureNonExistent;
