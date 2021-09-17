'use strict';

const readlineSync = require('readline-sync');
const ensureDirExists = require('./ensureDirExists');
const readDirWithoutSystemFiles = require('./readDirWithoutSystemFiles');
const checkYesNo = require('./checkYesNo');

/**
 * @param {{directory?: string, assumeYes: boolean}} argv
 * @param {string} directory
 */
function ensureEmptyDir(argv, directory) {
    const dir = directory ?? argv.directory;

    ensureDirExists(argv, directory);

    let result = readDirWithoutSystemFiles(dir).length === 0;
    result = result || (argv.assumeYes ?? checkYesNo(
        readlineSync.question(dir + ' is not empty! Continue? (y/n)')
    ));

    return result;
}

module.exports = ensureEmptyDir;
