'use strict';

const fs = require('fs');
const tar = require('tar');

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
