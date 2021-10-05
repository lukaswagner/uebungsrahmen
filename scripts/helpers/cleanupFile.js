'use strict';

const fs = require('fs');

/**
 *
 * @param {file} file
 * @param {*} patterns
 * @returns
 */
function cleanupFile(file, patterns) {
    const content = fs.readFileSync(file);

    let cleaned = content.toString('utf8');
    let count = 0;

    patterns.forEach((p) => {
        count += (cleaned.match(p) || []).length;
        cleaned = cleaned.replace(p, '');
    });

    return {
        file,
        count,
        content,
        cleaned
    };
}

module.exports = cleanupFile;
