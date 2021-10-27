'use strict';

const checkArchive = require('../helpers/checkArchive');
const chooseArchive = require('../helpers/chooseArchive');
const importAssignment = require('../helpers/importAssignment');
const importSubmission = require('../helpers/importSubmission');
const loadAssignments = require('../helpers/loadAssignments');
const log = require('../helpers/log');
const logList = require('../helpers/logList');

async function importArchive(argv) {
    if (!['assignment', 'submission'].includes(argv.mode.toLowerCase())) {
        log.error(`Invalid import mode: ${argv.mode}. Aborting.`);
        return;
    }

    const modeA = argv.mode.toLowerCase() === 'assignment';
    const archives = [...new Set(argv.input.map((i) => chooseArchive(i)))];

    if (archives.length > 1) {
        if (!modeA) {
            log.error(
                'Import of multiple archives only works ' +
                'when importing assignments! Aborting.');
            return;
        }
        logList('Importing archives:', archives);
    }
    else {
        console.log(`Importing archive ${archives[0]}...`);
    }

    const { assignments, assignmentsPath } =
        loadAssignments(argv.directory);

    const archiveInfo = [];
    const shouldImport = await Promise.all(archives.map(async (archive) => {
        const { shouldImport, index, newConfig } =
            await checkArchive(argv, archive, assignments);
        archiveInfo.push({ archive, index, newConfig });
        return shouldImport;
    }));
    if (!shouldImport.every((v) => v)) {
        log.error('Aborting.');
        return;
    }

    if (argv.mode.toLowerCase() === 'assignment') {
        for (const a of archiveInfo) await importAssignment(
            argv, a.archive, assignments, assignmentsPath, a.index, a.newConfig
        );
    }
    else {
        const a = archiveInfo[0];
        await importSubmission(argv, a.archive, assignments, a.index);
    }
};

module.exports = importArchive;
