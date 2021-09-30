'use strict';

const tar = require('tar');

/**
 * Checks if a given file is found inside a tar archive.
 * @param {string} archive Archive to check.
 * @param {string} file File path inside the archive.
 * @returns {boolean} True if the file was found, false otherwise;
 */
function checkFileInArchive(archive, file) {
    let success = false;
    tar.list({
        file: archive,
        onentry: () => success = true,
        sync: true
    }, [file]);
    return success;
}

module.exports = checkFileInArchive;
