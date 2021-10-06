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
const filename = require('./filename');

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

    if (!askYesNo(argv, 'Continue?')) {
        log.error('Aborting.');
        return;
    }

    // tar does not support packing from memory
    const temp = fs.mkdtempSync(os.tmpdir() + path.sep);

    prog = new Progress('Writing tmp files', files.length);
    const paths = cleaned.map((f) => {
        prog.increase();
        const buf = f.count > 0 ? Buffer.from(f.cleaned, 'utf8') : f.content;
        const p = path.relative(config.exerciseDir, f.file);
        const t = path.join(temp, p);
        ensureDirExists(path.dirname(t));
        fs.writeFileSync(t, buf);
        return t;
    });
    prog.done();

    const file = filename(argv, config, assignment);

    tar.create(
        {
            file: path.join(defines.exportDir, file),
            gzip: true,
            sync: true,
            cwd: temp
        },
        paths
    );

    fs.rmSync(temp, { recursive: true, force: true });

    log.success('Done!');
}

module.exports = exportAssignment;
