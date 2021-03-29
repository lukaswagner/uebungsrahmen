# uebungsrahmen

Current feature progress:

- loading `assignment.json`
- loading `exercise.json` for exercises in `assignment.json`
- generate index page containing all assignments and exercises
- generate `js`/`ts` entry points for exercises based on `exercise.json`
- provide extendable exercise template
- generate pages for exercises based on `exercise.json`
- handle rich exercise assignment texts **with live reload**
  - markdown
  - latex in md (inline/block/left-aligned block)
  - code highlighting in md
- use loaders for all resources: easy referencing of images etc.
- provide alias for framework dir: easy referencing of files without `..`
