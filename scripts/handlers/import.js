'use strict';

const json = require('../helpers/json');
const checkArchive = require('../helpers/checkArchive');
const chooseArchive = require('../helpers/chooseArchive');
const importAssignment = require('../helpers/importAssignment');
const importSubmission = require('../helpers/importSubmission');
const loadAssignments = require('../helpers/loadAssignments');
const log = require('../helpers/log');

async function importArchive(argv) {
    if (!['assignment', 'submission'].includes(argv.mode.toLowerCase())) {
        log.error(`Invalid import mode: ${argv.mode}. Aborting.`);
        return;
    }

    const config = json.read(argv.config);
    const archive = chooseArchive(argv.input);

    console.log(`Importing archive ${archive}...`);

    const { assignments, assignmentsPath } =
        loadAssignments(config.exerciseDir);
    const { shouldImport, index, newConfig } =
        await checkArchive(argv, archive, assignments);
    if (!shouldImport) {
        log.error('Aborting.');
        return;
    }

    if (argv.mode.toLowerCase() === 'assignment')
        importAssignment(
            argv, config, archive,
            assignments, assignmentsPath, index, newConfig);
    else
        importSubmission(config, archive, assignments, index);
};

module.exports = importArchive;
