'use strict';

const tar = require('tar');
const defines = require('../../defines.json');

function importSubmission(config, archive, assignments, index) {
    console.log(
        `Importing submission for assignment ${assignments[index].name}...`);

    tar.extract({
        file: archive,
        cwd: config.exerciseDir,
        filter: (path) => path !== defines.assignmentConfig,
        sync: true
    });

    console.log('Done!');
};

module.exports = importSubmission;
