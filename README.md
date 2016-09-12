# gulp-vm2html [![Build Status](https://travis-ci.org/calledT/gulp-vm2html.svg?branch=master)](https://travis-ci.org/calledT/gulp-vm2html)

## Usage

```js
var gulp = require('gulp');
var vm2html = require('gulp-vm2html');

gulp.task('vm2html', function() {
	var stream = gulp.src('src/vm/**/*.vm')
			.pipe(vm2html({vmRootpath: __dirname + '/src/vm'}))
			.pipe(gulp.dest('src/html'));

	return stream;
})
```

## Options

#### vmRootpath
- Type: `String`
- Required: `true`


#### mockRootpath
- Type: `String`
- Required: `false`
- Default: Same to vmRootpath

Mock data's name must same to template. If mockRootpath is ignore, mock data should stay beside the template, otherwise it should place in mockbase folder
with template's folder structure.

#### mockExtname
- Type: `String`
- Required: `false`
- Default: '.js'


#### macro 
- Type: `String`
- Required: `false`

Set global macro path if you had.

#### excldue 
- Type: `String`,`Array`
- Required: `false`
 
The condition parameter is any of the conditions supported by [gulp-match](https://github.com/robrich/gulp-match). The file.path is passed into gulp-match.

#### encoding
- Type: `String`
- Required: `false`
- Default: `utf-8`


## License

(MIT License)

Copyright (c) 2016 [calledT](//calledt.com)
