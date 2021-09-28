'use strict';

const path = require('path');

function getLink(source, target, title) {
    const fullFile = path.join(path.dirname(source), target);
    const withSlashes = fullFile.replace(/\\/g, '/');
    const href = 'vscode://file/' + withSlashes;
    const basename = path.basename(fullFile);
    const a = `<a href="${href}">${title ?? basename}</a>`;
    return a;
}

function loader(source) {
    const regex = /vscode-link\(([^\,\)]*)(?:\,\s?(.*))?\)/g;
    return source.replace(regex, (match, p1, p2) => {
        return getLink(this.resourcePath, p1, p2);
    });
}

module.exports = loader;
