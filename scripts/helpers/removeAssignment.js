'use strict';

const fs = require('fs');
const path = require('path');
const defines = require('../../defines.json');
const askYesNo = require('./askYesNo');

/**
 * Removes an assignment, removing both the exercises and the reference in the
 * assignments.json file.
 * @param {import('../types').ArgY} argv Command line args.
 * @param {import('../types').Assignment} assignment Assignment to remove.
 * @param {string} dir Working dir.
 * @returns {boolean} Whether the assignment was successfully removed.
 */
function removeAssignment(argv, assignment, dir) {
    const dirs = assignment.exercises.map((e) => path.join(dir, e));
    console.log(
        'Removing the following directories:',
        ...dirs.map((d) => `\n- ${d}`)
    );
    const yes = askYesNo(argv, 'Continue?');
    if (yes) {
        dirs.forEach((d) => fs.rmSync(d, { recursive: true, force: true }));
        fs.rmSync(
            path.join(dir, defines.archiveStoreDir, assignment.archive),
            { force: true }
        );
    }

    return yes;
}

module.exports = removeAssignment;
