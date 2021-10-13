'use strict';

function logList(label, entries) {
    console.log(label);
    if (entries.length > 0) entries.forEach((f) => console.log('-', f));
    else console.log('- None');
}

module.exports = logList;
