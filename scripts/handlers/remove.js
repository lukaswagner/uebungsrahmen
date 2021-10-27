'use strict';

const fs = require('fs');
const path = require('path');
const json = require('../helpers/json');
const loadAssignments = require('../helpers/loadAssignments');
const log = require('../helpers/log');
const removeAssignment = require('../helpers/removeAssignment');

async function rmAssignment(argv) {
    const { assignments, assignmentsPath } =
        loadAssignments(argv.directory);
    const index = assignments.findIndex((a) => a.id === argv.assignment);
    if (index < 0) {
        log.error(`Assignment ${argv.assignment} not found! Aborting.`);
        return;
    }

    console.log(`Removing assignment ${assignments[index].name}...`);
    const removed =
        await removeAssignment(argv, assignments[index], argv.directory);
    if (!removed) {
        log.error('Aborting.');
        return;
    }

    assignments.splice(index, 1);
    json.write(assignmentsPath, assignments);
    log.success('Done!');
}

function rmAll(argv) {
    if (!argv.complete) {
        log.error(
            'Without specifying an assignment, all will be removed.' +
            'If this is intended, see fw rm --help.'
        );
        return;
    }

    console.log('Removing everything...');
    const dir = path.join(process.cwd(), argv.directory);
    console.log(`Removing ${dir}`);
    fs.rmSync(dir, { recursive: true, force: true });
    console.log(`Removing ${argv.config}`);
    fs.rmSync(argv.config, { force: true });
    log.success('Done!');
}

async function remove(argv) {
    if (argv.assignment) await rmAssignment(argv);
    else rmAll(argv);
}

module.exports = remove;
