'use strict';

/**
 *
 * @param {string} assignmentId
 * @param {import("../types").Assignments} assignments
 */
function chooseAssignment(assignmentId, assignments) {
    const assignment = assignments.find((a) => a.id === assignmentId);
    if (!!assignmentId && !!assignment) return assignment;

    const sorted = assignments.slice();
    // highest id (lexicographically)
    sorted.sort((a, b) => b.id.localeCompare(a.id));
    // highest import time (latest)
    sorted.sort((a, b) => b.importTime - a.importTime);

    return sorted[0];
}

module.exports = chooseAssignment;
