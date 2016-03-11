'use strict';
var assert = require('assert');
var gutil = require('gulp-util');
var path = require('path');
var velocity = require('../');

it('should compile with mock', function(cb) {
  var stream = velocity({vmRootpath: 'test/vm'});

  stream.on('data', function(data) {
    assert.equal(data.contents.toString(), 'foo');
  });

  stream.on('end', cb);

  stream.write(new gutil.File({
    path: path.join(__dirname, 'vm/foo.vm'),
    contents: new Buffer('$name')
  }));

  stream.end();
});

it('should compile without mock', function(cb) {
  var stream = velocity({vmRootpath: 'test/vm'});

  stream.on('data', function(data) {
    assert.equal(data.contents.toString(), '$name');
  });

  stream.on('end', cb);

  stream.write(new gutil.File({
    path: path.join(__dirname, 'vm/baz.vm'),
    contents: new Buffer('$name')
  }));

  stream.end();
});

it('should use mockRootpath', function(cb) {
  var stream = velocity({vmRootpath: 'test/vm', mockRootpath: 'test/mock'});

  stream.on('data', function(data) {
    assert.equal(data.contents.toString(), 'mockRootpath');
  });

  stream.on('end', cb);

  stream.write(new gutil.File({
    path: path.join(__dirname, 'vm/foo.vm'),
    contents: new Buffer('$name')
  }));

  stream.end();
});

it('should exclude file', function(cb) {
  var stream = velocity({vmRootPath: 'test/vm', exclude: '**/foo.vm'});

  stream.on('data', function(data) {
    assert.equal(data.contents.toString(), '');
  });

  stream.on('end', cb);

  stream.write(new gutil.File({
    path: path.join(__dirname, 'vm/foo.vm'),
    contents: new Buffer('$name')
  }));

  stream.end();
});

it('should compile with #parse directive', function(cb) {
  var stream = velocity({vmRootpath: 'test/vm'});

  stream.on('data', function(data) {
    assert.equal(data.contents.toString(), 'foo\nfoo');
  });

  stream.on('end', cb);

  stream.write(new gutil.File({
    path: path.join(__dirname, 'vm/foo.vm'),
    contents: new Buffer('#parse("bar.vm")$name')
  }));

  stream.end();
});

