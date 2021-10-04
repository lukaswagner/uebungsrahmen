'use strict';

const path = require('path');
const checkArchive = require('../helpers/checkArchive');
const chooseArchive = require('../helpers/chooseArchive');
const importAssignment = require('../helpers/importAssignment');
const importSubmission = require('../helpers/importSubmission');
const loadAssignments = require('../helpers/loadAssignments');

async function importArchive(argv) {
    if (!['assignment', 'submission'].includes(argv.mode.toLowerCase())) {
        console.log(`Invalid import mode: ${argv.mode}. Aborting.`);
        return;
    }

    const config = require(path.join(process.cwd(), argv.config));
    const archive = chooseArchive(argv.input);

    console.log(`Importing archive ${archive}...`);

    const { assignments, assignmentsPath } =
        loadAssignments(config.exerciseDir);
    const { shouldImport, index, newConfig } =
        await checkArchive(argv, archive, assignments);
    if (!shouldImport) {
        console.log('Aborting.');
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
