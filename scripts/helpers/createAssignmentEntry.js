'use strict';

function createAssignmentEntry(archive, newAssignment) {
    const now = Date.now();
    // generated values should overwrite values in newAssignment
    return Object.assign({}, newAssignment, {
        archive: now.toString() + '.tgz',
        importTime: now
    });
}

module.exports = createAssignmentEntry;
