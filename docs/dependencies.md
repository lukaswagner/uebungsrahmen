# dependencies

You'll need to have Node.js (and npm) and git available from the command line. Try running `node --version`, `npm --version` and `git --version` to check. See below for notes about Node.js/npm versions.

## node.js

Binaries/install instructions can be found [here](https://nodejs.org/).

For Ubuntu (or similar) users: Do **not** install Node using apt, the version is out of date. See [here](https://github.com/nodesource/distributions/blob/master/README.md) for installation instruction.

### Compatible versions

- v12 or earlier: Not working, some interfaces are too outdated.
- v14 (comes with npm v6): **Recommended.**
- v16 (comes with npm v7): Should work, not thoroughly tested though. If an error occurs during `npm install`, try running `npm install --legacy-peer-deps`.

## git

Binaries/install instructions can be found [here](https://git-scm.com/).
