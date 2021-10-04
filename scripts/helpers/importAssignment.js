'use strict';

const fs = require('fs');
const path = require('path');
const tar = require('tar');
const defines = require('../../defines.json');
const createAssignmentEntry = require('./createAssignmentEntry');
const ensureDirExists = require('./ensureDirExists');
const removeAssignment = require('./removeAssignment');

/**
 * Imports an assignment archive.
 * @param {import('../types').ArgY} argv Command line args.
 * @param {import('../types').Config} config Framework config.
 * @param {string} archive Archive to import.
 * @param {import('../types').Assignments} assignments The existing assignments.
 * @param {string} assignmentsPath Path to assignments.json.
 * @param {number} index Index of existing assignment with same id.
 * @param {import('../types').Assignment} assignment The new assignment config.
 */
function importAssignment(
    argv, config, archive, assignments, assignmentsPath, index, assignment
) {
    console.log(`Importing assignment ${assignment.name}...`);

    const entry = createAssignmentEntry(assignment);
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
    ensureDirExists(archiveStoreDir);

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
