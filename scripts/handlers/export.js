'use strict';

const fs = require('fs');
const path = require('path');
const defines = require('../../defines.json');
const archiveName = require('../helpers/archiveName');
const askYesNo = require('../helpers/askYesNo');
const chooseAssignment = require('../helpers/chooseAssignment');
const exportAssignment = require('../helpers/exportAssignment');
const exportSubmission = require('../helpers/exportSubmission');
const loadAssignments = require('../helpers/loadAssignments');
const log = require('../helpers/log');

async function exportArchive(argv) {
    console.log(argv);
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
        !await askYesNo(argv, `${file} already exists. Overwrite?`, true)
    ) return;

    if (argv.mode.toLowerCase() === 'assignment')
        await exportAssignment(argv, assignment, file);
    else
        await exportSubmission(argv, assignment, file);

    console.log('Created file:', file);
    log.success('Done!');
};

module.exports = exportArchive;
