'use strict';

const fs = require('fs');

function read(file) {
    return JSON.parse(fs.readFileSync(file));
}

function write(file, content) {
    fs.writeFileSync(file, JSON.stringify(content, undefined, 4));
}

const json = {
    read,
    write
};

module.exports = json;
