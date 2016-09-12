'use strict';
var should = require('should');
var gutil = require('gulp-util');
var path = require('path');
var velocity = require('../');

describe('gulp-vm2html', function() {

  it('should compile with mock', function(done) {
    var stream = velocity({vmRootpath: path.resolve(__dirname, 'vm')});

    stream.on('data', function(data) {
      data.contents.toString().should.equal('foo');
    });

    stream.on('end', done);

    stream.write(new gutil.File({
      path: path.join(__dirname, 'vm/foo.vm'),
      contents: new Buffer('$name')
    }));

    stream.end();
  });

  it('should compile without mock', function(done) {
    var stream = velocity({vmRootpath: path.resolve(__dirname, 'vm')});

    stream.on('data', function(data) {
      data.contents.toString().should.equal('$name');
    });

    stream.on('end', done);

    stream.write(new gutil.File({
      path: path.join(__dirname, 'vm/baz.vm'),
      contents: new Buffer('$name')
    }));

    stream.end();
  });

  it('should use mockRootpath', function(done) {
    var stream = velocity({
      vmRootpath: path.resolve(__dirname, 'vm'),
      mockRootpath: path.resolve(__dirname, 'mock')
    });

    stream.on('data', function(data) {
      data.contents.toString().should.equal('mockRootpath');
    });

    stream.on('end', done);

    stream.write(new gutil.File({
      path: path.join(__dirname, 'vm/foo.vm'),
      contents: new Buffer('$name')
    }));

    stream.end();
  });

  it('should use mockExtname', function(done) {
    var stream = velocity({
      vmRootpath: path.resolve(__dirname, 'vm'),
      mockRootpath: path.resolve(__dirname, 'mock'),
      mockExtname: '.json'
    });

    stream.on('data', function(data) {
      data.contents.toString().should.equal('mockExtname');
    });

    stream.on('end', done);

    stream.write(new gutil.File({
      path: path.join(__dirname, 'vm/foo.vm'),
      contents: new Buffer('$name')
    }));

    stream.end();
  });

  it('should exclude file', function(done) {
    var stream = velocity({
      vmRootPath: path.resolve(__dirname, 'vm'),
      exclude: '**/foo.vm'
    });

    stream.on('data', function(data) {
      data.contents.toString().should.equal('');
    });

    stream.on('end', done);

    stream.write(new gutil.File({
      path: path.join(__dirname, 'vm/foo.vm'),
      contents: new Buffer('$name')
    }));

    stream.end();
  });

  it('should compile with #parse directive', function(done) {
    var stream = velocity({vmRootpath: path.resolve(__dirname, 'vm')});

    stream.on('data', function(data) {
      data.contents.toString().should.equal('foo\nfoo');
    });

    stream.on('end', done);

    stream.write(new gutil.File({
      path: path.join(__dirname, 'vm/foo.vm'),
      contents: new Buffer('#parse("bar.vm")$name')
    }));

    stream.end();
  });

  it('should emit mock file errors correctly', function(done) {
    var stream = velocity({
      vmRootpath: path.resolve(__dirname, 'vm'),
      mockRootpath: path.resolve(__dirname, 'mock')
    });

    stream.on('error', function(err) {
      err.message.should.containEql('Unexpected token');
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

  it('should emit velocity file errors correctly', function(done) {
    var stream = velocity({vmRootpath: path.resolve(__dirname, 'vm')});

    stream.on('error', function(err) {
      err.message.should.containEql('Param of #parse not exists or is not subpath of root.');
      done();
    })

    stream.on('data', function(data) {
      throw new Error('no file should have been emitted!');
    });

    stream.write(new gutil.File({
      path: path.join(__dirname, 'vm/error.vm'),
      contents: new Buffer('#parse("vm/notexist.vm")')
    }));

    stream.end();
  });
})

