'use strict';

const fs = require('fs');
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

function init(argv) {
    createConfig(argv);
    ensureEmptyDir(argv);
}

module.exports = init;
