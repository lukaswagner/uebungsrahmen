'use strict';

const fs = require('fs');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const mdTex = require('markdown-it-texmath');
const hljs = require('highlight.js');

const config = require('./config.json');

// collect assignments, resolve exercise dirs to exercise configs
const assignmentPath = path.join(__dirname, config.exercisePath, 'assignments.json');
const assignments = require(assignmentPath)
    .map((assignment) => {
        const clone = Object.assign({}, assignment);
        clone.exercises = assignment.exercises.map((exercise) => {
            const exDir = path.join(config.exercisePath, exercise);
            const exFile = path.join(exDir, 'exercise.json');
            const ex = JSON.parse(fs.readFileSync(exFile));
            return Object.assign({ id: exercise, path: exDir }, ex);
        });
        return clone;
    });

// collect exercise from assignments
const exercises =
    assignments
        .map((a) => a.exercises.map((ex) => {
            return Object.assign({ assignment: a }, ex);
        }))
        .flat();

// collect entry points from exercises
let entries = {};
exercises.forEach((e) => entries[e.id] = path.resolve(e.path, e.entry));

// prepare exercise pages
const pages = exercises
    .filter((exercise, index) => {
        return exercises.findIndex((ex) => ex.id === exercise.id) === index;
    })
    .map((exercise) => {
        return new HtmlWebpackPlugin({
            filename: exercise.id + '.html',
            template: path.join(exercise.path, exercise.page),
            templateParameters: { config, exercise, assignments },
            chunks: [exercise.id, 'style', 'toggle']
        });
    });

// prepare index page
const index = new HtmlWebpackPlugin({
    filename: 'index.html',
    template: './source/pages/index.pug',
    templateParameters: { config, assignments },
    chunks: ['index', 'style', 'toggle']
});

const highlight = (string, language) => {
    const prefix = '<pre class="hljs"><code>';
    const suffix = '</code></pre>';
    if (language && hljs.getLanguage(language)) {
        try {
            const content = hljs.highlight(
                string,
                { language, ignoreIllegals: true }
            ).value;
            return prefix + content + suffix;
        } catch (error) { }
    }

    return '';
}

module.exports = {
    entry: Object.assign({
        index: './source/code/index.ts',
        style: './source/code/style.ts',
        toggle: './source/code/toggle.ts'
    }, entries),
    plugins: [index, ...pages],
    mode: 'development',
    devtool: 'inline-source-map',
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'build'),
    },
    resolve: {
        extensions: ['.ts', '...'],
        alias: {
            fw: path.resolve(__dirname, 'source'),
            ex: path.resolve(__dirname, config.exercisePath),
            theme_css: path.resolve(
                __dirname,
                `node_modules/highlight.js/styles/atom-one-${config.theme}.css`)
        },
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: { loader: 'ts-loader' },
                exclude: /node_modules/,
            },
            {
                test: /\.pug$/,
                use: {
                    loader: 'pug-loader',
                    options: { root: path.resolve(__dirname, 'source/pages') }
                },
            },
            {
                test: /\.md$/,
                use: [
                    {
                        loader: 'html-loader',
                        options: { esModule: false }
                    },
                    {
                        loader: 'markdown-it-loader',
                        options: { use: [mdTex], highlight }
                    }
                ],
            },
            {
                test: /\.css$/,
                use: [
                    { loader: 'style-loader' },
                    { loader: 'css-loader' }
                ]
            },
            {
                test: /\.(glsl|vert|frag)$/,
                use: { loader: 'webpack-glsl-loader' },
            },
            {
                test: /\.(png|jpe?g|gif|bmp|tiff?|webp)$/,
                type: 'asset/resource',
                generator: { filename: 'img/[name]_[hash:4][ext]' }
            },
            {
                test: /\.(webm|mkv|avi|mp4|m4v)$/,
                type: 'asset/resource',
                generator: { filename: 'vid/[name]_[hash:4][ext]' }
            },
            {
                test: /\.(json|obj|gltf|glb|stl)$/,
                type: 'asset/resource',
                generator: { filename: 'dat/[name]_[hash:4][ext]' }
            },
            {
                test: /\.(eot|otf|ttf|woff|woff2)$/,
                type: 'asset/resource',
                generator: { filename: 'fnt/[name]_[hash:4][ext]' }
            },
        ]
    },
}
