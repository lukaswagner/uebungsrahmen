'use strict';

const readlineSync = require('readline-sync');
const checkYesNo = require('./checkYesNo');

/**
 * Asks the user a yes/no question.
 * If the --assumeYes/-y argument was provided, the question will be skipped.
 * @param {import('../types').ArgY} argv Config.
 * @param {string} question The question to ask.
 * @returns {boolean} The user's answer.
 */
function askYesNo(argv, question) {
    return argv?.assumeYes ??
        checkYesNo(readlineSync.question(question + ' (y/n) '));
}

module.exports = askYesNo;
