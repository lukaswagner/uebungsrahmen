'use strict';

const fs = require('fs');
const path = require('path');
const tar = require('tar');
const defines = require('../../defines.json');
const absolutePath = require('./absolutePath');
const createAssignmentEntry = require('./createAssignmentEntry');
const ensureDirExists = require('./ensureDirExists');
const json = require('./json');
const log = require('./log');
const removeAssignment = require('./removeAssignment');

/**
 * Imports an assignment archive.
 * @param {import('../types').ImportAssignmentOptions} argv Config.
 * @param {string} archive Archive to import.
 * @param {import('../types').Assignments} assignments The existing assignments.
 * @param {string} assignmentsPath Path to assignments.json.
 * @param {number} index Index of existing assignment with same id.
 * @param {import('../types').Assignment} assignment The new assignment config.
 */
async function importAssignment(
    argv, archive, assignments, assignmentsPath, index, assignment
) {
    console.log(`Importing assignment ${assignment.name}...`);

    const entry = createAssignmentEntry(assignment);
    if (index === -1) {
        assignments.push(entry);
    } else {
        const removed = await removeAssignment(
            argv, assignments[index], argv.directory);
        if (!removed) {
            log.error('Aborting.');
            return;
        }
        assignments[index] = entry;
    }

    const archiveStoreDir =
        absolutePath(path.join(argv.directory, defines.archiveStoreDir));
    ensureDirExists(archiveStoreDir);

    fs.copyFileSync(archive, path.join(archiveStoreDir, entry.archive));

    tar.extract({
        file: archive,
        cwd: argv.directory,
        filter: (path) => path !== defines.assignmentConfig,
        sync: true
    });

    json.write(assignmentsPath, assignments);

    if (assignment.dependencies) {
        child.spawnSync(
            'npm',
            [
                'install',
                ...npmInstallParams,
                '-D', assignment.dependencies
            ],
            {
                shell: true,
                stdio: 'inherit',
                cwd: path.normalize(argv.directory)
            });
    }

    log.success('Done!');
};

module.exports = importAssignment;
