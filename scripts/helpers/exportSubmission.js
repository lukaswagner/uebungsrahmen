'use strict';

const fs = require('fs');
const path = require('path');
const os = require('os');
const tar = require('tar');
const defines = require('../../defines.json');
const askYesNo = require('./askYesNo');
const ensureDirExists = require('./ensureDirExists');
const log = require('./log');
const json = require('./json');
const checkChangedFiles = require('./checkChangedFiles');
const logList = require('./logList');

function collectFiles(argv, assignment, func) {
    return assignment.exercises
        .map((e) => {
            const p = path.join(argv.directory, e, defines.exerciseConfig);
            const conf = json.read(p);
            const files = func(conf) ?? [];
            return files.map((f) => path.join(e, f));
        })
        .flat()
        .map((f) => path.normalize(f));
}

/**
 *
 * @param {import('../types').ExportOptions} argv Config.
 * @param {import('../types').Assignment} assignment
 */
async function exportSubmission(argv, assignment, file) {
    console.log(`Exporting solution assignment ${assignment.id}...`);

    // exclude exercise.json by default (can be manually added)
    const changedFiles = checkChangedFiles(argv, assignment)
        .filter((f) => path.basename(f) !== defines.exerciseConfig);
    const manualFiles = collectFiles(argv, assignment, (e) => e.include);
    const excludedFiles = collectFiles(argv, assignment, (e) => e.exclude);

    const files = [...new Set([...changedFiles, ...manualFiles])]
        .filter((f) => !excludedFiles.includes(f));

    if (manualFiles.length > 0 || excludedFiles.length > 0) {
        logList('Changed files:', changedFiles);
        logList('Manually included files:', manualFiles);
        logList('Excluded files:', excludedFiles);
    }
    logList('Exporting:', files);

    if (!await askYesNo(argv, 'Continue?')) {
        log.error('Aborting.');
        return;
    }

    // tar does not support packing from memory
    // while the code files could be read from the original locations,
    // creating the json requires a temp dir anyway
    // copying everything there makes packing easier
    const temp = fs.mkdtempSync(os.tmpdir() + path.sep);

    files.forEach((f) => {
        const from = path.join(argv.directory, f);
        const to = path.join(temp, f);
        ensureDirExists(path.dirname(to));
        fs.copyFileSync(from, to);
    });

    json.write(path.join(temp, defines.submissionConfig), {
        id: assignment.id,
        authors: argv.authors
    });

    tar.create(
        {
            file,
            gzip: true,
            sync: true,
            cwd: temp
        },
        [...files, defines.submissionConfig]
    );

    fs.rmSync(temp, { recursive: true, force: true });

    console.log('Created file:', file);
    log.success('Done!');
}

module.exports = exportSubmission;
