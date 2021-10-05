'use strict';

const path = require('path');
const json = require('../helpers/json');
const ensureEmptyDir = require('../helpers/ensureEmptyDir');
const ensureNonExistent = require('../helpers/ensureNonExistent');

function createConfig(argv) {
    const config = {
        lecture: argv.lecture,
        exerciseDir: argv.directory,
        theme: argv['color-theme'],
    };
    if (!ensureNonExistent(argv, argv.config)) process.exit(1);
    json.write(argv.config, config);
}

function createAssignments(argv) {
    const file = path.join(argv.directory, 'assignments.json');
    const assignments = [];
    if (!ensureNonExistent(argv, file)) process.exit(1);
    json.write(file, assignments);
}

function init(argv) {
    createConfig(argv);
    ensureEmptyDir(argv);
    createAssignments(argv);
}

module.exports = init;
