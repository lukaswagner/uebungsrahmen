'use strict';

const path = require('path');
const json = require('../helpers/json');
const defines = require('../../defines.json');
const ensureEmptyDir = require('../helpers/ensureEmptyDir');
const ensureNonExistent = require('../helpers/ensureNonExistent');
const ensureDirExists = require('../helpers/ensureDirExists');
const copyRecursive = require('../helpers/copyRecursive');
const runNpm = require('../helpers/runNpm');

function createConfig(argv) {
    const config = {
        lecture: argv.lecture,
        directory: argv.directory,
        theme: argv.theme,
        authors: argv.authors
    };
    if (!ensureNonExistent(argv, argv.config)) process.exit(1);
    json.write(argv.config, config);
}

function init(argv) {
    createConfig(argv);
    ensureEmptyDir(argv);
    copyRecursive(path.normalize('./template'), path.normalize(argv.directory));
    runNpm(['i', '--silent'], { cwd: path.normalize(argv.directory) });
    ensureDirExists(defines.importDir);
    ensureDirExists(defines.exportDir);
}

module.exports = init;
