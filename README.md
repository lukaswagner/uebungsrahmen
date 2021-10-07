# uebungsrahmen

Framework for web-based exercise, designed to be reusable between lectures. Set up to be used with WebGL/[webgl-operate](https://webgl-operate.org/) out of the box.

## dependencies

You'll need to have Node.js (and npm) and git available from the command line. Try running `node --version`, `npm --version` and `git --version` to check. See below for notes about Node.js/npm versions.

### node.js

Binaries/install instructions can be found [here](https://nodejs.org/).

For Ubuntu (or similar) users: Do **not** install Node using apt, the version is out of date. See [here](https://github.com/nodesource/distributions/blob/master/README.md) for installation instruction.

Version notes:
- v12 or earlier: Not working, some interfaces are too outdated.
- v14 (comes with npm v6): **Recommended.**
- v16 (comes with npm v7): Should work, not thoroughly tested though. If an error occurs during `npm install`, try running `npm install --legacy-peer-deps`.

### git

Binaries/install instructions can be found [here](https://git-scm.com/).

## quick start

Note: `fw.sh` and `fw.bat` are wrappers for `npm run --silent main --`, making commands shorter and avoiding errors ([forgetting the `--`](https://docs.npmjs.com/cli/v7/commands/npm-run-script)).

```sh
# install dependencies
npm install
# initialize exercise dir
./fw.sh init -l 'My Lecture' -d '../exercises' -a 111111 222222
# import assignment
./fw.sh import -i './archives/assignment01.tgz'
# work on assignment
./fw.sh start
# export solution
./fw.sh export
```

## improvements over v1:

- more generalized architecture -> usable e.g. for plain WebGL exercises
- separate framework and exercises -> fw reusable between lectures
- better support for embedded files (md reload, advanced latex)
- controls visible when in fullscreen view
- less dependencies
- dark theme
- add links to local files in assignment text
