'use strict';

const fs = require('fs');
const path = require('path');
const os = require('os');
const child = require('child_process');
const stream = require('stream');
const defines = require('../../defines.json');
const log = require('../helpers/log');
const json = require('../helpers/json');
const { stdout } = require('process');
const kill = require('../helpers/kill');
const readDirRecursive = require('../helpers/readDirRecursive');

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
function runSync(cmd, args, options) {
    console.log(log.blue('Running command:'), cmd, ...args);
    const result = child.spawnSync(cmd, args, options);
    if (result.status !== 0) {
        log.error('Error occurred.');
    }
    return result;
}

/**
 * @param {string} cmd
 * @param {string[]} args
 * @param {child.SpawnSyncOptionsWithStringEncoding} options
 * @returns {child.ChildProcess}
 */
function run(cmd, args, options) {
    console.log(log.blue('Running command:'), cmd, ...args);
    return child.spawn(cmd, args, options);
}

function editFile(file, func, parseJson = false) {
    const read = parseJson ? json.read : fs.readFileSync;
    const write = parseJson ? json.write : fs.writeFileSync;
    const content = read(file, { encoding: 'utf8' });
    const edited = func(content);
    write(file, edited, { encoding: 'utf8' });
    return () => write(file, content, { encoding: 'utf8' });
}

async function test(argv) {
    const dir = './temp';
    const config = './temp.json';
    const configArgs = ['--config', config];
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
    runSync(command, [
        'init',
        '--lecture', 'TEST',
        '--directory', dir,
        '--authors', 'user1', 'user2',
        ...configArgs
    ], options);

    console.log(log.blue('Created config:'));
    console.log(json.read(config));

    // export assignment - manipulate first to check REMOVE detection
    heading('Export assignment from ./examples');
    const undoEdit = editFile(
        './examples/baseExample/code/index.ts',
        (c) => c + '// REMOVE BEGIN\ntop secret\n// REMOVE END\n');

    const tempDir = fs.mkdtempSync(os.tmpdir() + path.sep);
    runSync(command, [
        'exportAssignment',
        '--output', tempDir,
        '--config', 'example.json',
        yesArg
    ], options);

    undoEdit();

    // import assignment
    heading('Import assignment into ./temp');
    runSync(command, [
        'importAssignment',
        '--input', tempDir,
        ...configArgs,
        yesArg
    ], options);

    console.log(log.blue('Assignment list:'));
    console.log(json.read(path.join(dir, defines.assignmentsConfig)));

    // start the server
    heading('Starting server');
    const server = run(command, [
        'start',
        ...configArgs,
        '--', '--no-open'
    ], {
        stdio: ['inherit', 'pipe', 'inherit'],
        shell: true,
        encoding: 'utf8'
    });
    const serverRead = new stream.PassThrough();
    server.stdout.pipe(serverRead);
    server.stdout.pipe(stdout);

    const regex = /compiled (?:(successfully)|(?:with (\d+) errors)) in/g;
    const ansi = /\x1b\[.*?m/g;
    serverRead.on('data', (d) => {
        const str = d.toString().replace(ansi, '');
        const match = regex.exec(str);
        if (!match) return;
        let status = 'with unknown result';
        if (!!match[1]) status = 'successfully';
        if (!!match[2]) status = 'with errors';

        setTimeout(() => {
            console.log(log.blue(
                `Started server ${status}. Killing the process...`));
            kill(server);
        }, 100);
    });

    await new Promise((res) => server.on('close', res));
    console.log(log.blue('Server stopped.'));

    // export submission - manipulate first to check change detection
    heading('Export submission from ./temp');
    editFile(
        './temp/baseExample/code/index.ts',
        (c) => '#define true false\n' + c);
    editFile(
        './temp/baseExample/exercise.json',
        (c) => {
            c.exclude = ['./code/index.ts'];
            c.include = ['./index.pug'];
            return c;
        },
        true);
    runSync(command, [
        'exportSubmission',
        '--output', tempDir,
        ...configArgs,
        yesArg
    ], options);

    // import submission, resetting assignment
    heading('Importing submission');
    runSync(command, [
        'importSubmission',
        '--input', tempDir,
        '--resetAssignment',
        ...configArgs,
        yesArg
    ], options);

    // reset changes by re-importing assignment
    heading('Resetting assignment');
    runSync(command, [
        'reset',
        '--assignment', '1',
        ...configArgs,
        yesArg
    ], options);

    // remove a single assignment
    heading('Removing single assignment');
    runSync(command, [
        'remove',
        '--assignment', '1',
        ...configArgs,
        yesArg
    ], options);

    console.log(log.blue('Assignment list:'));
    console.log(json.read(path.join(dir, defines.assignmentsConfig)));

    console.log(log.blue('Files in assignment dir:'));
    console.log(readDirRecursive(dir, false, true));

    // remove whole setup
    heading('Removing everything');
    runSync(command, [
        'remove',
        ...configArgs,
        '--complete',
    ], options);

    // clean up
    heading('All done. Cleaning up temp dir.');
    fs.rmSync(tempDir, { recursive: true, force: true });
};

module.exports = test;
