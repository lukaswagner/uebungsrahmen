'use strict';

exports.command = ['initialize', 'init', 'i'];
exports.description = 'Initializes the framework.';
exports.handler = require('../handlers/init.js');
exports.builder = (yargs) => {
    yargs
        .option('assumeYes', require('../options/assumeYes'))
        .option('force', require('../options/force'))
        .option('lecture', require('../options/lecture'))
        .option('directory', require('../options/directory'))
        .option('theme', require('../options/theme'))
        .option('template', require('../options/template'))
        .option('authors', require('../options/authors'));
};
