'use strict';

const fs = require('fs');

/**
 *
 * @param {{force: boolean}} argv
 * @param {string} file
 * @returns {boolean}
 */
function ensureNonExistent(argv, file) {
    let result = !fs.existsSync(file);
    result |= argv.force;
    if (!result) console.error(file, 'already exists!');
    return result;
}

module.exports = ensureNonExistent;
