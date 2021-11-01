'use strict';

const path = require('path');

function absolutePath(str) {
    if (path.isAbsolute(str)) return str;
    return path.join(process.cwd(), str);
}

module.exports = absolutePath;
