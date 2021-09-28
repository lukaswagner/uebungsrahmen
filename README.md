# uebungsrahmen

Framework for web-based exercise, designed to be reusable between lectures. Set up to be used with WebGL/[webgl-operate](https://webgl-operate.org/) out of the box.

## quick start

Note: `fw.sh` and `fw.bat` are wrappers for `npm run --silent main --`, making commands shorter and avoiding errors ([forgetting the `--`](https://docs.npmjs.com/cli/v7/commands/npm-run-script)).

```sh
# install dependencies
npm install
# initialize exercise dir
./fw.sh init -l 'My Lecture' -d '../exercises'
# import assignment
./fw.sh import -a './archives/assignment01.tgz'
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
