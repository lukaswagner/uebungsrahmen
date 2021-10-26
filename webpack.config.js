'use strict';

const fs = require('fs');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const mdTex = require('markdown-it-texmath');
const hljs = require('highlight.js');
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');
const configurations = require('./scripts/helpers/configurations');

let configFile = process.env.fw_config;
if (!fs.existsSync(configFile)) configFile = './example.json';
console.log('Using config file:', configFile);
configurations.setMostRecent(configFile);
const config = require(configFile);

// collect assignments, resolve exercise dirs to exercise configs
const assignmentPath =
    path.join(__dirname, config.directory, 'assignments.json');
const assignments = require(assignmentPath)
    .map((assignment) => {
        const clone = Object.assign({}, assignment);
        clone.exercises = assignment.exercises.map((exercise) => {
            const exDir = path.join(config.directory, exercise);
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
const entries = {};
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
            chunks: [exercise.id, 'tools']
        });
    });

// prepare index page
const index = new HtmlWebpackPlugin({
    filename: 'index.html',
    template: './source/pages/index.pug',
    templateParameters: { config, assignments },
    chunks: ['tools']
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
};

module.exports = {
    entry: Object.assign({
        tools: './source/code/tools.ts'
    }, entries),
    plugins: [
        index,
        ...pages,
        new NodePolyfillPlugin()
    ],
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
            helper: path.resolve(__dirname, 'source/code/helper'),
            ex: path.resolve(__dirname, config.directory),
            theme_css: path.resolve(
                __dirname,
                `node_modules/highlight.js/styles/atom-one-${config.theme}.css`)
        },
        fallback: {
            'fs': false
        }
    },
    resolveLoader: {
        modules: ['node_modules', path.resolve(__dirname, 'loaders')]
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
                        loader: 'table-loader'
                    },
                    {
                        loader: 'markdown-it-loader',
                        options: {
                            use: [mdTex], highlight, html: true
                        }
                    },
                    {
                        loader: 'vscode-loader'
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
                test: /\.(obj|gltf|glb|stl)$/,
                type: 'asset/resource',
                generator: { filename: 'dat/[name]_[hash:4][ext]' }
            },
            {
                test: /\.(eot|otf|ttf|woff|woff2)$/,
                type: 'asset/resource',
                generator: { filename: 'fnt/[name]_[hash:4][ext]' }
            },
            {
                test: /\.(json)$/,
                type: 'asset/source',
                generator: { filename: 'dat/[name]_[hash:4][ext]' }
            },
        ]
    },
    devServer: {
        hot: false
    }
};
