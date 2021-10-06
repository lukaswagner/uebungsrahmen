'use strict';

const fs = require('fs');
const path = require('path');
const archiveName = require('../helpers/archiveName');
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

    const file = !!argv.output && fs.existsSync(argv.output) ?
        fs.statSync(argv.output).isDirectory() ?
            path.join(argv.output, archiveName(argv, assignment)) :
            argv.output :
        path.join(defines.exportDir, archiveName(argv, assignment));

    if (fs.existsSync(file) &&
        !askYesNo(argv, `${file} already exists. Overwrite?`)
    ) return;

    if (argv.mode.toLowerCase() === 'assignment')
        exportAssignment(argv, assignment, file);
    else { }
};

module.exports = exportArchive;
