: # you can run this script on both windows and unix
: # if it doesn't work, just run node directly
:; node ./scripts/main.js $*; exit;
@echo off
node .\scripts\main.js %*
