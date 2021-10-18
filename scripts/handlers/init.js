'use strict';

const fs = require('fs');
const path = require('path');
const https = require('https');
const { Buffer } = require('buffer');
const { Readable } = require('stream');
const tar = require('tar');
const json = require('../helpers/json');
const defines = require('../../defines.json');
const ensureEmptyDir = require('../helpers/ensureEmptyDir');
const ensureNonExistent = require('../helpers/ensureNonExistent');
const ensureDirExists = require('../helpers/ensureDirExists');
const copyRecursive = require('../helpers/copyRecursive');
const runNpm = require('../helpers/runNpm');
const log = require('../helpers/log');

function createConfig(argv) {
    const config = {
        lecture: argv.lecture,
        directory: argv.directory,
        theme: argv.theme,
        authors: argv.authors
    };
    if (!ensureNonExistent(argv, argv.config)) process.exit(1);
    json.write(argv.config, config);
}

async function setupTemplate(argv) {
    const template = argv.template;
    console.log('loading', template);
    const target = path.normalize(argv.directory);
    const normalized = path.normalize(template);
    const local = fs.existsSync(normalized);
    if (local) {
        const stat = fs.statSync(normalized);
        const dir = local && stat.isDirectory();
        if (dir) {
            copyRecursive(normalized, target);
            return true;
        }
        const file = local && stat.isFile();
        if (file) {
            tar.extract({ file: normalized, sync: true, cwd: target });
            return true;
        }
    }
    const link = await new Promise((resolve) => {
        const req = https.request(template, { method: 'HEAD' }, (res) => {
            const success = res.statusCode === 200;
            if (success) console.log(
                'File size according to server:',
                res.headers['content-length']);
            resolve(success);
        });
        req.on('error', () => {
            resolve(false);
        });
        req.end();
    });
    if (link) {
        const data = await new Promise(
            /**
             * @param {(b: Buffer) => void} resolve
             */
            (resolve) => {
                https.get(template, (res) => {
                    const data = [];
                    res.on('data', (d) => data.push(Buffer.from(d, 'binary')));
                    res.on('end', () => resolve(Buffer.concat(data)));
                }).on('error', () => {
                    resolve(undefined);
                });
            });
        console.log(`Received ${data.length} bytes`);
        const stream = Readable.from(data);
        stream.pipe(tar.extract({ sync: true, cwd: target }));
        return true;
    }
    log.error('Unable to handle given template! Aborting.');
    return false;
}

async function init(argv) {
    createConfig(argv);
    ensureEmptyDir(argv);
    if (!await setupTemplate(argv)) return;
    runNpm(['i'], { cwd: path.normalize(argv.directory) });
    ensureDirExists(defines.importDir);
    ensureDirExists(defines.exportDir);
}

module.exports = init;
