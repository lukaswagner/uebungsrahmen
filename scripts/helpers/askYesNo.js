'use strict';

const readlineSync = require('readline-sync');
const checkYesNo = require('./checkYesNo');

/**
 * Asks the user a yes/no question.
 * If the --assumeYes/-y argument was provided, the question will be skipped.
 * @param {import('../types').ArgFY} argv Config.
 * @param {string} question The question to ask.
 * @param {boolean} requiresForce Whether force is required for auto-yes.
 * @returns {boolean} The user's answer.
 */
function askYesNo(argv, question, requiresForce = false) {
    const defaultAnswer = requiresForce ?
        argv?.force ?? false :
        argv?.assumeYes ?? false;
    return defaultAnswer ||
        checkYesNo(readlineSync.question(question + ' (y/n) '));
}

module.exports = askYesNo;
