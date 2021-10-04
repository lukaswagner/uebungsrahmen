'use strict';

/**
 * Checks if a given string represents a positive or negative answer.
 * @param {string} answer The string to check.
 * @returns {boolean} Whether the string contains a positive answer.
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
