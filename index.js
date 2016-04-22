// through2 is a thin wrapper around node transform streams
var through     = require('through2');
var gutil       = require('gulp-util');
var gmatch      = require('gulp-match');
var path        = require('path');
var fs          = require('fs');
var Engine      = require('velocity').Engine;
var PluginError = gutil.PluginError;

// Consts
const PLUGIN_NAME = 'gulp-vm2html';

function getMock(vmPath, vmRootpath, mockRootpath, mockExtname) {
  if (mockRootpath) {
    vmPath = path.join(process.cwd(), mockRootpath, vmPath.replace(vmRootpath, ''));
  }

  var mockPath = gutil.replaceExtension(vmPath, mockExtname);
  if (fs.existsSync(mockPath)) {
    return mockPath;
  } else {
    return {};
  }
}


module.exports = function(opt) {

  function transform(file, enc, cb) {
    if (file.isNull()) {
      cb(null, file);
      return;
    }

    if (file.isStream()) {
      cb(new PluginError(PLUGIN_NAME, 'Streaming not supported'));
      return;
    }

    if (opt.exclude && gmatch(file, opt.exclude)) {
      cb(null);
      return;
    }

    if (opt.macro && gmatch(file, path.join('**',opt.macro))) {
      cb(null);
      return;
    }

    if (!opt.vmRootpath) {
      cb(new PluginError(PLUGIN_NAME, 'vmRootpath option is required'));
      return;
    }

    if (!opt.mockExtname) {
      opt.mockExtname = '.js';
    }

    var data;
    var str = file.contents.toString('utf8');
    var rootpath = path.join(process.cwd(), opt.vmRootpath);
    var context = getMock(file.path, rootpath, opt.mockRootpath, opt.mockExtname);

    var config = {
      encoding: opt.encoding || 'utf8',
      root: rootpath,
      macro: opt.macro,
      template: str
    };

    try {
      opt.verbose && console.log(PLUGIN_NAME + ' rendering template: ' + file.path);
      data = new Engine(config).render(context);
    } catch (err) {
      return cb(new PluginError(PLUGIN_NAME, err));
    }

    file.contents = new Buffer(data);
    file.path = gutil.replaceExtension(file.path, '.html');

    cb(null, file);
  }

  return through.obj(transform);
};
