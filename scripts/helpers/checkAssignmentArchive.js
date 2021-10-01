'use strict';

const fs = require('fs');
const path = require('path');
const readlineSync = require('readline-sync');
const defines = require('../../defines.json');
const checkFileInArchive = require('./checkFileInArchive');
const askYesNo = require('./askYesNo');
const readFileFromArchive = require('./readFileFromArchive');

async function checkAssignmentArchive(argv, archive, assignments) {
    const confFile = defines.assignmentConfig;
    const assignmentConfigFound = checkFileInArchive(archive, confFile);

    if (!assignmentConfigFound) {
        console.error(
            `Archive ${archive} does not contain ${confFile}. Aborting.`);
        return { shouldImport: false };
    }

    const newAssignment = await readFileFromArchive(archive, confFile);

    const existingIndex =
        assignments.findIndex((a) => a.id === newAssignment.id);

    const shouldImport = existingIndex === -1 || askYesNo(
        argv, 'Assignment with this ID already exists! Overwrite?'
    );

    return {
        shouldImport,
        existingIndex,
        newAssignment
    };
}

module.exports = checkAssignmentArchive;
