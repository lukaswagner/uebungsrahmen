'use strict';

const fs = require('fs');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const mdTex = require('markdown-it-texmath');

const config = require('./assignments.json');

// collect assignments, resolve exercise dirs to exercise configs
const assignments =
    config.assignments
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
const pages = exercises.map((exercise) => {
    return new HtmlWebpackPlugin({
        filename: exercise.id + '.html',
        template: path.join(exercise.path, exercise.page),
        templateParameters: { config, exercise },
        chunks: [exercise.id, 'style']
    });
});

// prepare index page
const index = new HtmlWebpackPlugin({
    filename: 'index.html',
    template: './source/pages/index.pug',
    templateParameters: { config, assignments },
    chunks: ['index', 'style']
});

module.exports = {
    entry: Object.assign({
        index: './source/code/index.ts',
        style: './source/code/style.ts'
    }, entries),
    plugins: [index, ...pages],
    mode: 'development',
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'build'),
    },
    resolve: {
        alias: {
            fw: path.resolve(__dirname, 'source'),
            ex: path.resolve(__dirname, config.exercisePath),
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
                        options: { use: [mdTex] }
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
