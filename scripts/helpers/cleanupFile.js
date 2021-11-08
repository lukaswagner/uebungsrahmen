'use strict';

const fs = require('fs');

/**
 * @param argv
 * @param {file} file
 * @param {*} patterns
 * @returns
 */
function cleanupFile(argv, file, patterns) {
    const content = fs.readFileSync(file);

    let cleaned = content.toString('utf8');
    let count = 0;

    if (argv.remove)
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
