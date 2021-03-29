'use strict';

const fs = require('fs');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const config = require('./assignments.json');

const assignments =
    config.assignments
        .map((assignment) => {
            const clone = Object.assign({}, assignment);
            clone.exercises = assignment.exercises.map((exercise) => {
                const exDir = path.join(config.exercisePath, exercise);
                const exFile = path.join(exDir, 'exercise.json');
                const ex = JSON.parse(fs.readFileSync(exFile));
                return Object.assign({
                    id: exercise,
                    path: exDir
                }, ex);
            });
            return clone;
        });

const exercises =
    assignments
        .map((a) => a.exercises.map((ex) => {
            return Object.assign({ assignment: a }, ex);
        }))
        .flat();

let entries = {};
exercises.forEach((e) => entries[e.id] = path.resolve(e.path, e.entry));

const pages = exercises.map((exercise) => {
    return new HtmlWebpackPlugin({
        filename: exercise.id + '.html',
        template: path.join(exercise.path, exercise.page),
        templateParameters: {
            config,
            exercise
        },
        chunks: [exercise.id]
    });
});

const index = new HtmlWebpackPlugin({
    filename: 'index.html',
    template: './source/pages/index.pug',
    templateParameters: {
        config,
        assignments
    },
    chunks: ['index']
});

module.exports = {
    entry: Object.assign({ index: './source/code/index.ts' }, entries),
    plugins: [index, ...pages],
    mode: 'development',
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'build'),
    },
    resolve: {
        alias: {
            fw: path.resolve(__dirname, 'source'),
            ex: path.resolve(__dirname, 'assignment.exercisePath'),
        },
    },
    module: {
        rules: [
            {
                test: /\.pug$/,
                use: {
                    loader: 'pug-loader',
                    options: { root: path.resolve(__dirname, 'source/pages') }
                },
            },
            {
                test: /\.md$/,
                use: [{
                    loader: 'html-loader'
                }, {
                    loader: 'markdown-loader'
                }],
            },
            {
                test: /\.png$/,
                type: 'asset/resource'
            }
        ]
    },
}
