'use strict';

const tar = require('tar');
const defines = require('../../defines.json');
const log = require('./log');
const resetAssignment = require('./resetAssignment');

/**
 * Imports a submission archive.
 * @param {import('../types').ImportSubmissionOptions} argv Config.
 * @param {string} archive Archive to import.
 * @param {import('../types').Assignments} assignments The existing assignments.
 * @param {number} index Index of existing assignment with same id.
 */
async function importSubmission(argv, archive, assignments, index) {
    if (argv.resetAssignment && index > -1)
        await resetAssignment(argv, assignments[index]);

    console.log(
        `Importing submission for assignment ${assignments[index].name}...`);

    tar.extract({
        file: archive,
        cwd: argv.directory,
        filter: (path) => path !== defines.assignmentConfig,
        sync: true
    });

    log.success('Done!');
};

module.exports = importSubmission;
