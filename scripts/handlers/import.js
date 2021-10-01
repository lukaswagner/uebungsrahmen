'use strict';

const fs = require('fs');
const path = require('path');
const tar = require('tar');
const defines = require('../../defines.json');
const checkAssignmentArchive = require('../helpers/checkAssignmentArchive');
const chooseArchive = require('../helpers/chooseArchive');
const createAssignmentEntry = require('../helpers/createAssignmentEntry');
const ensureDirExists = require('../helpers/ensureDirExists');
const loadAssignments = require('../helpers/loadAssignments');
const removeAssignment = require('../helpers/removeAssignment');

async function importArchive(argv) {
    const config = require(path.join(process.cwd(), argv.config));
    const archive = chooseArchive(argv.input);

    console.log(`Importing archive ${archive}...`);

    const { assignments, assignmentsPath } =
        loadAssignments(config.exerciseDir);
    const { shouldImport, existingIndex, newAssignment } =
        await checkAssignmentArchive(argv, archive, assignments);
    if (!shouldImport) {
        console.log('Aborting.');
        return;
    }

    console.log(`Importing assignment ${newAssignment.name}...`);

    const entry = createAssignmentEntry(archive, newAssignment);
    if (existingIndex === -1) {
        assignments.push(entry);
    } else {
        const removed = removeAssignment(
            argv, assignments[existingIndex], config.exerciseDir);
        if (!removed) {
            console.log('Aborting.');
            return;
        }
        assignments[existingIndex] = entry;
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

module.exports = importArchive;
