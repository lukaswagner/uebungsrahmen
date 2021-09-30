'use strict';

const fs = require('fs');
const path = require('path');
const readlineSync = require('readline-sync');
const defines = require('../../defines.json');
const checkFileInArchive = require('./checkFileInArchive');
const checkYesNo = require('./checkYesNo');
const readFileFromArchive = require('./readFileFromArchive');

async function checkAssignmentArchive(argv, archive, targetDir) {
    const confFile = defines.assignmentConfig;
    const assignmentConfigFound = checkFileInArchive(archive, confFile);

    if (!assignmentConfigFound) {
        console.error(
            `Archive ${archive} does not contain ${confFile}. Aborting.`);
        return { shouldImport: false };
    }

    const newAssignment = await readFileFromArchive(archive, confFile);

    const assignmentsPath = path.join(
        process.cwd(), targetDir, defines.assignmentsConfig);
    const assignments =
        fs.existsSync(assignmentsPath) ? require(assignmentsPath) : [];

    const existingIndex =
        assignments.findIndex((a) => a.id === newAssignment.id);

    const shouldImport = existingIndex === -1 || (argv.assumeYes ?? checkYesNo(
        readlineSync.question(
            'Assignment with this ID already exists! Overwrite? (y/n)')
    ));

    return {
        shouldImport,
        existingIndex,
        newAssignment
    };
}

module.exports = checkAssignmentArchive;
