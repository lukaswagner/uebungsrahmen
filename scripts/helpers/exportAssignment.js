'use strict';

const fs = require('fs');
const path = require('path');
const os = require('os');
const tar = require('tar');
const defines = require('../../defines.json');
const askYesNo = require('./askYesNo');
const cleanupFile = require('./cleanupFile');
const cleanupPatterns = require('./cleanupPatterns');
const ensureDirExists = require('./ensureDirExists');
const log = require('./log');
const Progress = require('./progress');
const readDirRecursive = require('./readDirRecursive');
const json = require('./json');

/**
 *
 * @param {import('../types').ArgY} argv Config.
 * @param {import('../types').Assignment} assignment
 */
async function exportAssignment(argv, assignment, file) {
    console.log(`Exporting assignment ${assignment.id}...`);
    const patterns = cleanupPatterns();

    const files = assignment.exercises.map((e) =>
        readDirRecursive(path.join(argv.directory, e)))
        .flat();

    let prog = new Progress('Parsing files', files.length);
    const cleaned = files.map((f) => {
        prog.increase();
        return cleanupFile(f, patterns);
    });
    prog.done();

    console.log('Exporting:');
    cleaned.forEach((f) => {
        const count = f.count > 0 ?
            f.count.toString().padStart(3) :
            ' '.repeat(3);
        console.log(`[${count}]`, f.file);
    });

    if (!await askYesNo(argv, 'Continue?')) {
        log.error('Aborting.');
        return;
    }

    // tar does not support packing from memory
    const temp = fs.mkdtempSync(os.tmpdir() + path.sep);

    prog = new Progress('Writing tmp files', files.length);
    const paths = cleaned.map((f) => {
        prog.increase();
        const buf = f.count > 0 ? Buffer.from(f.cleaned, 'utf8') : f.content;
        const p = path.relative(argv.directory, f.file);
        const t = path.join(temp, p);
        ensureDirExists(path.dirname(t));
        fs.writeFileSync(t, buf);
        return p;
    });
    prog.done();

    json.write(path.join(temp, defines.assignmentConfig), {
        name: assignment.name,
        id: assignment.id,
        exercises: assignment.exercises
    });

    tar.create(
        {
            file,
            gzip: true,
            sync: true,
            cwd: temp
        },
        [...paths, defines.assignmentConfig]
    );

    fs.rmSync(temp, { recursive: true, force: true });
}

module.exports = exportAssignment;
