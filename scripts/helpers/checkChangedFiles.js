'use strict';

const fs = require('fs');
const path = require('path');
const os = require('os');
const child = require('child_process');
const tar = require('tar');
const defines = require('../../defines.json');
const checkForGit = require('./checkForGit');

function checkChangedFiles(argv, assignment) {
    if (!checkForGit()) return;

    const temp = fs.mkdtempSync(os.tmpdir() + path.sep);

    tar.extract(
        {
            file: path.join(
                argv.directory, defines.archiveStoreDir, assignment.archive),
            sync: true,
            cwd: temp
        }
    );

    const exercises = assignment.exercises;

    const result = exercises.map((e) => {
        const output = child.spawnSync(
            'git',
            [
                'diff',
                '--no-index',
                '--name-only',
                '--diff-filter=d',
                path.join(temp, e),
                path.join(process.cwd(), argv.directory, e),
            ]).stdout.toString();
        return output
            .split('\n')
            .filter((f) => !!f)
            .map((f) => path.normalize(f))
            .map((f) => f.replace(/"/g, ''))
            .map((f) => path.relative(argv.directory, f));
    }).flat();

    fs.rmSync(temp, { recursive: true, force: true });

    return result;
}

module.exports = checkChangedFiles;
