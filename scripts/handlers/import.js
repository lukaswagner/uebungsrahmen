'use strict';

const path = require('path');
const checkAssignmentArchive = require('../helpers/checkAssignmentArchive');
const chooseArchive = require('../helpers/chooseArchive');

async function importArchive(argv) {
    const config = require(path.join(process.cwd(), argv.config));
    const archive = chooseArchive(argv.input);

    console.log(`Importing archive ${archive}...`);

    const { shouldImport, existingIndex, newAssignment } =
        await checkAssignmentArchive(argv, archive, config.exerciseDir);

    if (!shouldImport) {
        console.log('Aborting');
        return;
    }

    console.log(`Importing assignment ${newAssignment.name}...`);
};

module.exports = importArchive;
