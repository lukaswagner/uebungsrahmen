'use strict';

const fs = require('fs');
const path = require('path');
const os = require('os');
const child = require('child_process');
const log = require('../helpers/log');
const json = require('../helpers/json');

function heading(...text) {
    const mark = '=====';
    console.log(log.blue(mark, ...text, mark));
}

/**
 * @param {string} cmd
 * @param {string[]} args
 * @param {child.SpawnSyncOptionsWithStringEncoding} options
 * @returns {child.SpawnSyncReturns<string>}
 */
function run(cmd, args, options) {
    console.log(log.blue('Running command:'), cmd, ...args);
    const result = child.spawnSync(cmd, args, options);
    if (result.status !== 0) {
        log.error('Error occurred.');
    }
    return result;
}

const test = (argv) => {
    const dir = './temp';
    const config = './temp.json';
    const configArg = ['--config', config];
    const yesArg = '--assumeYes';
    const command = os.platform() === 'win32' ? '.\\fw.bat' : './fw.sh';
    const options = { stdio: 'inherit', shell: true, encoding: 'utf8' };

    // check temp files
    const tempFound = fs.existsSync(dir) || fs.existsSync(config);
    if (tempFound && !argv.force) {
        log.error(
            `${dir} or ${config} already exists!`,
            'Remove them or specify --force to remove them automatically.',
            'Aborting.'
        );
        return;
    }
    fs.rmSync(dir, { recursive: true, force: true });
    fs.rmSync(config, { force: true });

    // setup temp config and dir
    heading('Creating temporary assignment setup');
    run(command, [
        'init',
        '--lecture', 'TEST',
        '--directory', dir,
        '--authors', 'user1', 'user2',
        ...configArg
    ], options);

    console.log(log.blue('Created config:'));
    console.log(json.read(config));

    // export assignment - manipulate first to check REMOVE detection
    heading('Export assignment from ./examples');
    const exampleFile = './examples/baseExample/code/index.ts';
    const exampleCode = fs.readFileSync(exampleFile, { encoding: 'utf8' });
    fs.writeFileSync(
        exampleFile,
        exampleCode + '// REMOVE BEGIN\ntop secret\n// REMOVE END\n',
        { encoding: 'utf8' }
    );

    const tempDir = fs.mkdtempSync(os.tmpdir() + path.sep);
    run(command, [
        'exportAssignment',
        '--output', tempDir,
        '--config', 'example.json',
        yesArg
    ], options);

    fs.writeFileSync(exampleFile, exampleCode, { encoding: 'utf8' });

    fs.rmSync(tempDir, { recursive: true, force: true });
};

module.exports = test;
