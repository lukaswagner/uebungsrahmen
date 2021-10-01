'use strict';

const readlineSync = require('readline-sync');
const checkYesNo = require('./checkYesNo');

function askYesNo(argv, question) {
    return argv?.assumeYes ??
        checkYesNo(readlineSync.question(question + ' (y/n) '));
}

module.exports = askYesNo;
