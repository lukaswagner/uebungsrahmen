'use strict';

const fs = require('fs');
const path = require('path');
const defines = require('../../defines.json');
const askYesNo = require('./askYesNo');

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
