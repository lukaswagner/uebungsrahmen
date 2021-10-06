'use strict';

const defines = require('../../defines.json');

/**
 *
 * @param {import('../types').ExportOptions} argv Config.
 * @param {import('../types').Assignment} assignment
 * @returns
 */
function archiveName(argv, assignment) {
    let str = argv.mode === 'assignment' ?
        defines.assignmentFile :
        defines.submissionFile;

    str = str.replace(/{sep}/g, defines.filenameSeparator);
    str = str.replace(/{id}/g, assignment.id);
    str = str.replace(/{authors}/g, argv.authors.join('_'));

    return str;
}

module.exports = archiveName;
