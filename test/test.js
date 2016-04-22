'use strict';
var assert = require('assert');
var gutil = require('gulp-util');
var path = require('path');
var velocity = require('../');

describe('gulp-vm2html', function() {

  it('should compile with mock', function(done) {
    var stream = velocity({vmRootpath: 'test/vm'});

    stream.on('data', function(data) {
      assert.equal(data.contents.toString(), 'foo');
    });

    stream.on('end', done);

    stream.write(new gutil.File({
      path: path.join(__dirname, 'vm/foo.vm'),
      contents: new Buffer('$name')
    }));

    stream.end();
  });

  it('should compile without mock', function(done) {
    var stream = velocity({vmRootpath: 'test/vm'});

    stream.on('data', function(data) {
      assert.equal(data.contents.toString(), '$name');
    });

    stream.on('end', done);

    stream.write(new gutil.File({
      path: path.join(__dirname, 'vm/baz.vm'),
      contents: new Buffer('$name')
    }));

    stream.end();
  });

  it('should use mockRootpath', function(done) {
    var stream = velocity({vmRootpath: 'test/vm', mockRootpath: 'test/mock'});

    stream.on('data', function(data) {
      assert.equal(data.contents.toString(), 'mockRootpath');
    });

    stream.on('end', done);

    stream.write(new gutil.File({
      path: path.join(__dirname, 'vm/foo.vm'),
      contents: new Buffer('$name')
    }));

    stream.end();
  });

  it('should use mockExtname', function(done) {
    var stream = velocity({vmRootpath: 'test/vm', mockRootpath: 'test/mock', mockExtname: '.json'});

    stream.on('data', function(data) {
      assert.equal(data.contents.toString(), 'mockExtname');
    });

    stream.on('end', done);

    stream.write(new gutil.File({
      path: path.join(__dirname, 'vm/foo.vm'),
      contents: new Buffer('$name')
    }));

    stream.end();
  });

  it('should exclude file', function(done) {
    var stream = velocity({vmRootPath: 'test/vm', exclude: '**/foo.vm'});

    stream.on('data', function(data) {
      assert.equal(data.contents.toString(), '');
    });

    stream.on('end', done);

    stream.write(new gutil.File({
      path: path.join(__dirname, 'vm/foo.vm'),
      contents: new Buffer('$name')
    }));

    stream.end();
  });

  it('should compile with #parse directive', function(done) {
    var stream = velocity({vmRootpath: 'test/vm'});

    stream.on('data', function(data) {
      assert.equal(data.contents.toString(), 'foo\nfoo');
    });

    stream.on('end', done);

    stream.write(new gutil.File({
      path: path.join(__dirname, 'vm/foo.vm'),
      contents: new Buffer('#parse("bar.vm")$name')
    }));

    stream.end();
  });

  it('should emit errors correctly', function(done) {
    var stream = velocity({vmRootpath: 'test/vm', mockRootpath: 'test/mock'});

    stream.on('error', function(err) {
      assert.equal(err.message, 'Unexpected token }');
      done();
    })

    stream.on('data', function(data) {
      throw new Error('no file should have been emitted!');
    });

    stream.write(new gutil.File({
      path: path.join(__dirname, 'vm/error.vm'),
      contents: new Buffer('$!{name}')
    }));

    stream.end();
  });
})

