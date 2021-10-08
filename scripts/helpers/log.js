'use strict';

const util = require('util');

const reset = '\x1b[0m';
const r = '\x1b[31m';
const g = '\x1b[32m';
const y = '\x1b[33m';
const b = '\x1b[34m';

function colored(color, ...args) {
    return color + util.format(...args) + reset;
}

function red(...args) {
    return colored(r, ...args);
}

function yellow(...args) {
    return colored(y, ...args);
}

function green(...args) {
    return colored(g, ...args);
}

function blue(...args) {
    return colored(b, ...args);
}

function error(...args) {
    console.log(red(...args));
}

function warn(...args) {
    console.log(yellow(...args));
}

function success(...args) {
    console.log(green(...args));
}

const log = {
    red,
    yellow,
    green,
    blue,
    error,
    warn,
    success
};

module.exports = log;
