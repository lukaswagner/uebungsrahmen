'use strict';

/**
 *
 * @param {string} assignmentId
 * @param {import("../types").Assignments} assignments
 */
function chooseAssignment(assignmentId, assignments) {
    const assignment = assignments.find((a) => a.id === assignmentId);
    if (!!assignmentId && !!assignment) return assignment;

    return assignments
        .sort((a, b) => a.id - b.id)
        .sort((a, b) => b.importTime - a.importTime)[0];
}

module.exports = chooseAssignment;
