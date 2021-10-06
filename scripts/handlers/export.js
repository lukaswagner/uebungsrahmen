'use strict';

const chooseAssignment = require('../helpers/chooseAssignment');
const exportAssignment = require('../helpers/exportAssignment');
const loadAssignments = require('../helpers/loadAssignments');
const log = require('../helpers/log');

const exportArchive = (argv) => {
    if (!['assignment', 'submission'].includes(argv.mode.toLowerCase())) {
        log.error(`Invalid export mode: ${argv.mode}. Aborting.`);
        return;
    }
    const { assignments } = loadAssignments(argv.directory);
    const assignment = chooseAssignment(argv.assignment, assignments);
    if (!assignment) {
        log.error('No assignment to export! Aborting.');
        return;
    }

    if (argv.mode.toLowerCase() === 'assignment')
        exportAssignment(argv, assignment);
    else { }
};

module.exports = exportArchive;
