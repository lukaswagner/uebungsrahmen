'use strict';

const defaultPatterns = [
    // js, glsl, etc comments
    {
        start: /\/\/ ?REMOVE BEGIN/,
        end: /\/\/ ?REMOVE END/
    },
    // markdown comments
    {
        start: /# ?REMOVE BEGIN/,
        end: /# ?REMOVE END/
    }
];

const optionalLineStart = /(?:^\s*)?/;

/**
 *
 * @param {[{start: RegExp, end: RegExp}]} customPatterns
 * @param {boolean} includeDefault
 * @returns
 */
function cleanupPatterns(customPatterns = [], includeDefault = true) {
    return [
        ...(includeDefault ? defaultPatterns : []),
        ...(customPatterns ?? [])
    ]
        .map((p) => new RegExp(
            optionalLineStart.source + p.start.source + '.*?' + p.end.source,
            'gms'));
}

module.exports = cleanupPatterns;
