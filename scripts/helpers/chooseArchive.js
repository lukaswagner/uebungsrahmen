'use strict';

const fs = require('fs');
const path = require('path');
const defines = require('../../defines.json');
const findNewestFile = require('./findNewestFile');

function isTgz(file) {
    const lower = file.toLowerCase();
    return lower.endsWith('.tgz') || lower.endsWith('.tar.gz');
}

function isAssignementJson(file) {
    return path.basename(file) === defines.assignmentConfig;
}

function containsAssignementJson(dir) {
    return fs.readdirSync(dir, { withFileTypes: true })
        .some((e) => isAssignementJson(e.name));
}

function chooseArchive(target) {
    const exists = !!target && fs.existsSync(target);
    if (!exists) return undefined;

    const stat = fs.statSync(target);
    if (stat.isFile()) {
        if (isTgz(target)) return target;
        if (isAssignementJson(target)) console.log(
            `${target} is an unpacked ${defines.assignmentConfig}! ` +
            'Please do not unpack the archive manually.');
        console.log(`Given file ${target} isn't a tgz archive.`);
        return undefined;
    }
    else if (stat.isDirectory()) {
        if (containsAssignementJson(target)) console.log(
            `${target} contains an unpacked ${defines.assignmentConfig}! ` +
            'Please do not unpack the archive manually.');
        return findNewestFile(target, (e) => isTgz(e.name));
    }

    return undefined;
}

module.exports = chooseArchive;
