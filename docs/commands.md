# commands

`fw.bat` / `fw.sh` (abbreviated to `fw` below) are wrappers for `npm run --silent main --`. You can use the `npm` command if the scripts don't work for you (or you just want to, who am I to stop you), but don't forget the `--` or your arguments will be consumed by `npm`.

All commands and options have a short variant. Most options also have sensible defaults. E.g. instead of writing  
`fw export --assignment 'first' --output './export/myfile.tgz'`  
you could write  
`fw ex -a 'first' -o './export/myfile.tgz'`  
or even just  
`fw ex`,  
which will export the last assignment (by import time) with a matching filename to the `./export` directory.

## contents

- [commands](#commands)
  - [contents](#contents)
  - [general options](#general-options)
    - [help / h](#help--h)
    - [config / c](#config--c)
    - [assumeYes / yes / y](#assumeyes--yes--y)
    - [force / f](#force--f)
  - [build / b](#build--b)
  - [exportAssignment / ea](#exportassignment--ea)
  - [exportSubmission / export / es / ex / out](#exportsubmission--export--es--ex--out)
  - [importAssignment / import / ia / im / in](#importassignment--import--ia--im--in)
  - [importSubmission / is](#importsubmission--is)
  - [initialize / init / i](#initialize--init--i)
  - [remove / rm](#remove--rm)
  - [resetAssignment / reset / r](#resetassignment--reset--r)
  - [start / s](#start--s)

## general options

### help / h

You can use `fw help` to get help. If you need help for a specific command, use `fw <command> --help`.

### config / c

All commands accept (and require) a configuration file. The configurations are stored in `./config`. This will default to `config`. If you only need one work setup, you'll never need to touch this.

If you want to use the framework for multiple lectures (or need a test environment), you can use a different setup by specifying `--config otherConfName`. For creating a different setup, just pass the argument to `initialize`.

### assumeYes / yes / y

**Use with caution.**

Automatically answers yes to all yes/no prompts. This can have destructive consequences.

### force / f

**Use with extreme caution.**

Destructive sibling of assumeYes. Make sure you really mean what you typed before adding this to the command.

## build / b

Builds the exercises once.

## exportAssignment / ea

Exports an assignment archive.

By default, the assignment with the highest ID ([see here](../scripts/helpers/chooseAssignment.js)) is chosen. You can select a different assignment by specifying the ID using `--assignment`/`-a`.

During export, all sections marked for removal ([see here](../scripts/helpers/cleanupPatterns.js)) will be stripped.

The archive will be named based on the assignment ID. You can specify a different output directory or a specific file using `--output`/`-o`.

## exportSubmission / export / es / ex / out

Exports an submission archive.

By default, a submission for the newest assignment (by import timestamp) is created. You can select a different assignment by specifying the ID using `--assignment`/`-a`.

The created archive will contain all changed and added files (see the console output for the list). If you wish to exclude some of these files or add files which where not automatically included, you can add `exclude` and `include` arrays to the `exercise.json`.

The archive will be named based on the assignment ID and the authors IDs. You can specify a different output directory or a specific file using `--output`/`-o`.

## importAssignment / import / ia / im / in

Imports an assignment archive.

By default, the newest archive inside the `./import` directory is chosen. You can specify a different directory or a specific file using `--input`/`-i`.

You can specify multiple assignment archives to import.

## importSubmission / is

Imports an submission archive.

This requires the respective assignment to be already imported.

By default, the newest archive inside the `./import` directory is chosen. You can specify a different directory or a specific file using `--input`/`-i`.

You can choose to reset the respective assignment by re-importing it first (`--reset`/`-r`). This uses the backup archive created during import.

## initialize / init / i

Creates a work directory and matching configuration file.

Required arguments:
- `--lecture`/`-l`: Lecture title.
- `--directory`/`-d`: Where to store the assignments.
- `--authors`/`-a`: Student IDs of team members. Will be used to name your submissions.

## remove / rm

**Destructive command, use with caution.**

Removes the assignment given by `--assignment`/`-a` from the working directory.

Can also be used to completely remove the work directory and configuration file.

## resetAssignment / reset / r

**Destructive command, use with caution.**

Re-imports an assignment from the backup archive created during import.

## start / s

Starts the development server, hosting the built exercises and watching the sources for changes.
