'use strict';

const defines = require('../../defines.json');
const checkFileInArchive = require('./checkFileInArchive');
const askYesNo = require('./askYesNo');
const readFileFromArchive = require('./readFileFromArchive');
const log = require('./log');

/**
 * Checks if the given archive fulfills the requirements to be imported.
 * This includes containing a config file (based on the import mode) and
 * whether the archive conflicts with the existing assignments.
 * @param {import('../types').ArgMY} argv Config.
 * @param {string} archive Archive file to check.
 * @param {import('../types').Assignments} assignments The existing assignments.
 * @returns {import('../types').ImportCheckResult}
 */
async function checkArchive(argv, archive, assignments) {
    const confFile = argv.mode.toLowerCase() === 'assignment' ?
        defines.assignmentConfig : defines.submissionConfig;
    const configFound = checkFileInArchive(archive, confFile);

    if (!configFound) {
        log.error(`Archive ${archive} does not contain ${confFile}.`);
        return { shouldImport: false };
    }

    const newConfig = await readFileFromArchive(archive, confFile);

    const index =
        assignments.findIndex((a) => a.id === newConfig.id);

    const shouldImport = argv.mode.toLowerCase() === 'assignment' ?
        index === -1 || await askYesNo(
            argv, 'Assignment with this ID already exists! Overwrite?', true) :
        index > -1;

    return {
        shouldImport,
        index,
        newConfig
    };
}

module.exports = checkArchive;
