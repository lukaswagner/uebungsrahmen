# uebungsrahmen

Framework for web-based exercise, designed to be reusable between lectures. Set up to be used with WebGL/[webgl-operate](https://webgl-operate.org/) out of the box.

## dependencies

See [here](docs/dependencies.md) (summary: you'll need Node.js version 14 or 16 and git).

## graphical user interface

For the most common tasks, you can use the GUI:

```sh
# (once) install dependencies - for Node.js 16: add --legacy-peer-deps
npm install

# open ui
npm run ui
```

## quick start (for students)

Note: `./uebung.bat` is just a wrapper for `node ./scripts/main.js`. It should be able to run on both Windows and Unix. If it does not work on your system, just use the node command instead.

```sh
# install dependencies - for Node.js 16: add --legacy-peer-deps
npm install
# short version
npm i

# initialize working dir
./uebung.bat init --lecture "My Lecture" --directory "../exercises" --authors "authorId1" "authorId2"
# short version
./uebung.bat i -l "My Lecture" -d "../exercises" -a "authorId1" 

# import assignment
./uebung.bat import -i "./import/assignment01.tgz"
# short version (will select most recent archive inside ./import)
./uebung.bat im

# work on assignment
./uebung.bat start
# short version
./uebung.bat s

# export solution - see full command doc for note about included files
./uebung.bat export --assignment "id"
# short version (will select most recently imported assignment)
./uebung.bat ex
```

## quick start (for creating exercises)

```sh
# install dependencies
./uebung.bat install
# short version
./uebung.bat i

# initialize working dir
./uebung.bat init --lecture "My Lecture" --directory "../exercises"
# short version
./uebung.bat i -l "My Lecture" -d "../exercises"

# you can use one of the examples to initialize an exercise
cp -R "./examples/webglOperateExample" "../exercises/myAssignment"

# edit the assignments.json file to include the exercise
# see examples/assignments.json for an example
cp "./examples/assignments.json" "../exercises/assignments.json"

# work on assignment
./uebung.bat start
# short version
./uebung.bat s

# export assignment
./uebung.bat exportAssignment --assignment "id"
# short version (will select most recently imported assignment)
./uebung.bat ex
```

## grading

```sh
# import a submission, resetting the assignment before import
# note: only works if the assignment was imported,
# so probably not in your main code base.
./uebung.bat importSolution --input "./import/submission.tgz" --reset
# short version (will select most recent archive inside ./import)
./uebung.bat is -r
```

## full command documentation

See [here](docs/commands.md).

## improvements over v1:

- more generalized architecture -> usable e.g. for plain WebGL exercises
- separate framework and exercises -> fw reusable between lectures
- better support for embedded files (md reload, advanced latex)
- controls visible when in fullscreen view
- less dependencies
- dark theme
- add links to local files in assignment text
