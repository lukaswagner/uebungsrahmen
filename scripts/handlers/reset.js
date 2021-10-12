'use strict';

const loadAssignments = require('../helpers/loadAssignments');
const log = require('../helpers/log');
const resetAssignment = require('../helpers/resetAssignment');

function reset(argv) {
    const { assignments, assignmentsPath } =
        loadAssignments(argv.directory);
    const index = assignments.findIndex((a) => a.id === argv.assignment);
    if (index < 0) {
        log.error(`Assignment ${argv.assignment} not found! Aborting.`);
        return;
    }
    const assignment = assignments[index];

    if (!resetAssignment(argv, assignment)) return;

    log.success('Done!');
}

module.exports = reset;
