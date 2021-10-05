'use strict';

const tar = require('tar');
const defines = require('../../defines.json');
const log = require('./log');

/**
 * Imports a submission archive.
 * @param {import('../types').Config} config Framework config.
 * @param {string} archive Archive to import.
 * @param {import('../types').Assignments} assignments The existing assignments.
 * @param {number} index Index of existing assignment with same id.
 */
function importSubmission(config, archive, assignments, index) {
    console.log(
        `Importing submission for assignment ${assignments[index].name}...`);

    tar.extract({
        file: archive,
        cwd: config.exerciseDir,
        filter: (path) => path !== defines.assignmentConfig,
        sync: true
    });

    log.success('Done!');
};

module.exports = importSubmission;
