'use strict';

const fs = require('fs');
const tar = require('tar');

/**
 * Reads a text file from the archive.
 * @param {string} archive Archive to retrieve the file from.
 * @param {string} file The file's path inside the archive.
 * @returns {string} The file contents.
 */
async function readFileFromArchive(archive, file) {
    return new Promise((resolve) => {
        const parse = new tar.Parse({
            filter: (f) => f === file
        });

        parse.on('entry', (e) => {
            e.on('data', (buf) => {
                resolve(JSON.parse(buf.toString()));
            });
            e.resume();
        });

        fs.createReadStream(archive).pipe(parse);
    });
}

module.exports = readFileFromArchive;
