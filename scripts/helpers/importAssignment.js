'use strict';

const fs = require('fs');
const path = require('path');
const tar = require('tar');
const defines = require('../../defines.json');
const createAssignmentEntry = require('./createAssignmentEntry');
const ensureDirExists = require('./ensureDirExists');
const removeAssignment = require('./removeAssignment');

function importAssignment(
    argv, config, archive, assignments, assignmentsPath, index, assignment
) {
    console.log(`Importing assignment ${assignment.name}...`);

    const entry = createAssignmentEntry(archive, assignment);
    if (index === -1) {
        assignments.push(entry);
    } else {
        const removed = removeAssignment(
            argv, assignments[index], config.exerciseDir);
        if (!removed) {
            console.log('Aborting.');
            return;
        }
        assignments[index] = entry;
    }

    const archiveStoreDir =
        path.join(process.cwd(), config.exerciseDir, defines.archiveStoreDir);
    ensureDirExists(argv, archiveStoreDir);

    fs.copyFileSync(archive, path.join(archiveStoreDir, entry.archive));

    tar.extract({
        file: archive,
        cwd: config.exerciseDir,
        filter: (path) => path !== defines.assignmentConfig,
        sync: true
    });

    fs.writeFileSync(
        assignmentsPath,
        JSON.stringify(assignments, undefined, 4));

    console.log('Done!');
};

module.exports = importAssignment;
