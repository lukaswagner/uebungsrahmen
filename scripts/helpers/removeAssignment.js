'use strict';

const fs = require('fs');
const path = require('path');
const defines = require('../../defines.json');
const askYesNo = require('./askYesNo');

/**
 * Removes all exercises belonging to an exercises.
 * Note: Does not remove the entry in assignments.json.
 * @param {import('../types').ArgY} argv Config.
 * @param {import('../types').Assignment} assignment Assignment to remove.
 * @param {string} dir Working dir.
 * @returns {boolean} Whether the assignment was successfully removed.
 */
async function removeAssignment(argv, assignment, dir, removeArchive = true) {
    const dirs = assignment.exercises.map((e) => path.join(dir, e));
    console.log(
        'Removing the following directories:',
        ...dirs.map((d) => `\n- ${d}`)
    );
    const yes = await askYesNo(argv, 'Continue?');
    if (yes) {
        dirs.forEach((d) => fs.rmSync(d, { recursive: true, force: true }));
        if (removeArchive) fs.rmSync(
            path.join(dir, defines.archiveStoreDir, assignment.archive),
            { force: true }
        );
    }

    return yes;
}

module.exports = removeAssignment;
