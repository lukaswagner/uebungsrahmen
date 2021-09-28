'use strict';

const fs = require('fs');
const path = require('path');
const ensureEmptyDir = require("../helpers/ensureEmptyDir");
const ensureNonExistent = require('../helpers/ensureNonExistent');

function createConfig(argv) {
    const config = {
        lecture: argv.lecture,
        exerciseDir: argv.directory,
        theme: argv['color-theme'],
    }
    if (!ensureNonExistent(argv, argv.config)) process.exit(1);
    fs.writeFileSync(argv.config, JSON.stringify(config, undefined, 4));
}

function createAssignments(argv) {
    const file = path.join(argv.directory, 'assignments.json');
    const assignments = [];
    if (!ensureNonExistent(argv, file)) process.exit(1);
    fs.writeFileSync(file, JSON.stringify(assignments, undefined, 4));
}

function init(argv) {
    createConfig(argv);
    ensureEmptyDir(argv);
    createAssignments(argv);
}

module.exports = init;
