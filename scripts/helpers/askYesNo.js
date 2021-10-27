'use strict';

const readlineSync = require('readline-sync');
const checkYesNo = require('./checkYesNo');

async function askIpc(question) {
    return new Promise((resolve) => {
        process.once('message', (message) => {
            resolve(message);
        });
        process.send(question);
    });
}

async function askTerm(question) {
    return checkYesNo(readlineSync.question(question + ' (y/n) '));
}

/**
 * Asks the user a yes/no question.
 * If the --assumeYes/-y argument was provided, the question will be skipped.
 * @param {import('../types').ArgFY} argv Config.
 * @param {string} question The question to ask.
 * @param {boolean} requiresForce Whether force is required for auto-yes.
 * @returns {boolean} The user's answer.
 */
async function askYesNo(argv, question, requiresForce = false) {
    const defaultAnswer = requiresForce ?
        argv?.force ?? false :
        argv?.assumeYes ?? false;
    const ask = process.channel ? askIpc : askTerm;
    return defaultAnswer || await ask(question);
}

module.exports = askYesNo;
