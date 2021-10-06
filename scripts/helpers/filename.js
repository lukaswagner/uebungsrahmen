'use strict';

const defines = require('../../defines.json');

function filename(argv, config, assignment) {
    let str = argv.mode === 'assignment' ?
        defines.assignmentFile :
        defines.submissionFile;

    str = str.replace(/{sep}/g, defines.filenameSeparator);
    str = str.replace(/{id}/g, assignment.id);
    str = str.replace(/{authors}/g, config.authors.join('_'));

    return str;
}

module.exports = filename;
