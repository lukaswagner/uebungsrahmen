'use strict';

const child = require('child_process');
const log = require('./log');

/**
 * @typedef {{ major: number, minor: number, patch: number }} Version
 */

/**
 * @param {string} cmd
 * @returns {Version}
 */
function getVersion(cmd) {
    const result = child.spawnSync(cmd, ['--version'], { shell: true });
    const output = result.stdout.toString();
    const regex = /(\d+).(\d+).(\d+)/g;
    const matches = regex.exec(output);
    return {
        major: matches[1],
        minor: matches[2],
        patch: matches[3],
    };
}

const git = getVersion('git');
const node = getVersion('node');
const npm = getVersion('npm');

function checkVersions() {
    const gitOk = git.major >= 2;
    if (!gitOk) log.error(
        `Unsupported git version: ${git.major}.${git.minor}.${git.patch}`);
    const nodeOk = node.major >= 14;
    if (!nodeOk) log.error(
        `Unsupported node version: ${node.major}.${node.minor}.${node.patch}`);
    const npmOk = npm.major >= 6;
    if (!npmOk) log.error(
        `Unsupported npm version: ${npm.major}.${npm.minor}.${npm.patch}`);
    return gitOk && nodeOk && npmOk;
}

const npmInstallParams = npm.major > 6 ? ['--legacy-peer-deps'] : [];

module.exports = {
    getVersion,
    git,
    node,
    npm,
    checkVersions,
    npmInstallParams
};
