'use strict';

const ensureDirExists = require('./ensureDirExists');
const readDirWithoutSystemFiles = require('./readDirWithoutSystemFiles');
const askYesNo = require('./askYesNo');

/**
 * Checks if a given dir exists and is empty.
 * @param {import('../types').ArgDY} argv Config.
 * @param {string} directory Path to directory.
 * @returns {boolean} Whether the dir is empty (or --assumeYes was specified)
 */
function ensureEmptyDir(argv, directory) {
    const dir = directory ?? argv.directory;

    ensureDirExists(dir);

    let result = readDirWithoutSystemFiles(dir).length === 0;
    result = result || askYesNo(argv, dir + ' is not empty! Continue?');

    return result;
}

module.exports = ensureEmptyDir;
