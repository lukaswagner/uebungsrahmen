'use strict';

function getTable(width, contents) {
    let table = '<table>';
    const w = Math.floor(100 / width);
    while (contents.length) {
        let row = '<tr>';
        const rowContents = contents.splice(0, width);
        for (let i = 0; i < width; i++) {
            row += `<td style="width: ${w}%">${rowContents[i] ?? ''}</td>`;
        }
        row += '</tr>';
        table += row;
    }
    table += '</table>';

    return table;
}

function split(string) {
    const split = /(?:\^,|[^,])+/gm;
    const remove = /\^(.)/gm;
    return string
        .match(split)
        .map((s) => s.replace(remove, (match, p1) => p1).trim());
}

function loader(source) {
    const regex = /table\(\s?(\d+)(?:,\s?([^)]*))+\)/gm;
    return source.replace(regex, (match, p1, p2) => {
        return getTable(Number(p1), split(p2));
    });
}

module.exports = loader;
