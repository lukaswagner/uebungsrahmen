'use strict';

const log = require('./log');
const child = require('child_process');

function checkForGit() {
    const gitCheck = child.spawnSync(
        process.platform === 'win32' ? 'where' : 'which', ['git']);

    if (gitCheck.status !== 0) {
        log.error('Could not find git. Aborting.');
        return false;
    }

    return true;
}

module.exports = checkForGit;
