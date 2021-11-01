'use strict';

const path = require('path');
const tar = require('tar');
const defines = require('../../defines.json');
const removeAssignment = require('../helpers/removeAssignment');
const absolutePath = require('./absolutePath');

async function resetAssignment(argv, assignment) {
    console.log(`Resetting assignment ${assignment.name}...`);
    const removed =
        await removeAssignment(argv, assignment, argv.directory, false);
    if (!removed) {
        log.error('Aborting.');
        return false;
    }

    tar.extract({
        file: absolutePath(path.join(
            argv.directory, defines.archiveStoreDir, assignment.archive)),
        cwd: argv.directory,
        filter: (path) => path !== defines.assignmentConfig,
        sync: true
    });

    return true;
}

module.exports = resetAssignment;
