#!/bin/bash
echo "Counting lines of code in repo..."
touch linesOfCode.json
cloc --by-percent c --exclude-dir=vendor,_site --json --report-file=linesOfCode.json ../_data/* ../_i18n/* ../_images/* ../_includes/* ../_layouts/* ../_scss/* ../_site/* ../assets/* ../config/*
