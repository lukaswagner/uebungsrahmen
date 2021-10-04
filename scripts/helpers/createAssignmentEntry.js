'use strict';

/**
 * Creates assignment entry to add to assignments.json.
 * @param {import("../types").Assignment} newAssignment The assignment config
 * read from the imported archive.
 * @returns {import("../types").Assignment} The updated assignment config,
 * containing the import time and the filename for archiving the archive.
 */
function createAssignmentEntry(newAssignment) {
    const now = Date.now();
    // generated values should overwrite values in newAssignment
    return Object.assign({}, newAssignment, {
        archive: now.toString() + '.tgz',
        importTime: now
    });
}

module.exports = createAssignmentEntry;
