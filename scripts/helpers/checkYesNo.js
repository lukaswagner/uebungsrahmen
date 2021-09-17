'use strict';

/**
 * @param {string} answer
 * @returns {boolean}
 */
function checkYesNo(answer) {
    switch (answer.toLowerCase()) {
        case 'y':
        case 'z':
        case 'j':
        case 'ja':
        case 'yes':
            return true;
        case 'n':
        case 'no':
        default:
            return false;
    }
}

module.exports = checkYesNo;
