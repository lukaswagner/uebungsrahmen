'use strict';

const path = require('path');
const askYesNo = require('./askYesNo');
const cleanupFile = require('./cleanupFile');
const cleanupPatterns = require('./cleanupPatterns');
const log = require('./log');
const readDirRecursive = require('./readDirRecursive');

/**
 *
 * @param {import('../types').ArgY} argv
 * @param {import('../types').Assignment} assignment
 */
function exportAssignment(argv, config, assignment) {
    console.log(`Exporting assignment ${assignment.id}...`);

    const patterns = cleanupPatterns();

    const files = assignment.exercises.map((e) =>
        readDirRecursive(path.join(config.exerciseDir, e)))
        .flat()
        .map((f) => cleanupFile(f, patterns));

    console.log('Exporting:');
    files.forEach((f) => {
        const count = f.count > 0 ?
            f.count.toString().padStart(3) :
            ' '.repeat(3);
        console.log(`[${count}]`, f.file);
    });

    if (!askYesNo(argv, 'Continue?')) {
        log.error('Aborting.');
        return;
    }

    // TODO: write to disk
}

module.exports = exportAssignment;
