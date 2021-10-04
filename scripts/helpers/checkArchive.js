'use strict';

const defines = require('../../defines.json');
const checkFileInArchive = require('./checkFileInArchive');
const askYesNo = require('./askYesNo');
const readFileFromArchive = require('./readFileFromArchive');

async function checkArchive(argv, archive, assignments) {
    const confFile = argv.mode.toLowerCase() === 'assignment' ?
        defines.assignmentConfig : defines.submissionConfig;
    const configFound = checkFileInArchive(archive, confFile);

    if (!configFound) {
        console.error(
            `Archive ${archive} does not contain ${confFile}.`);
        return { shouldImport: false };
    }

    const newConfig = await readFileFromArchive(archive, confFile);

    const index =
        assignments.findIndex((a) => a.id === newConfig.id);

    const shouldImport = argv.mode.toLowerCase() === 'assignment' ?
        index === -1 || askYesNo(
            argv, 'Assignment with this ID already exists! Overwrite?') :
        index > -1;

    return {
        shouldImport,
        index,
        newConfig
    };
}

module.exports = checkArchive;
