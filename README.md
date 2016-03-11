# gulp-vm2html [![Build Status](https://travis-ci.org/calledT/gulp-vm2html.svg?branch=master)](https://travis-ci.org/calledT/gulp-vm2html)

## Usage

```js
var gulp = require('gulp');
var vm2html = require('gulp-vm2html');

gulp.task('vm2html', function() {
	var stream = gulp.src('src/vm/**/*.vm')
			.pipe(vm2html({vmRootpath: 'src/vm'}))
			.pipe(gulp.dest('src/html'));

	return stream;
})
```

## Options

#### vmRootpath
- Type: `String`
- Required: `true`
- Default: [file.base](https://github.com/wearefractal/glob2base)

If setting, it would be jion to `process.cwd()`.

#### mockRootpath
- Type: `String`
- Required: `false`
- Default: Same to Velocity template

Mock data's name must same to template. If mockRootpath is ignore, mock data should stay beside the template, otherwise it should place in mockbase folder
with template's folder structure.

#### outputExt
- Type: `String`
- Required: `false`
- Default `.html`

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
- Default: `utf-8`


## License

(MIT License)

Copyright (c) 2016 [calledT](//calledt.com)
