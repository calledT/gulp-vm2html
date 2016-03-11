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

function getMock(vmPath, vmRootpath, mockRootpath) {
  if (mockRootpath) {
    vmPath = path.join(process.cwd(), mockRootpath, vmPath.replace(vmRootpath, ''));
  }

  var mockPath = gutil.replaceExtension(vmPath, '.js');
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

    var config = {
      encoding: opt.encoding || 'utf8',
      root: path.join(process.cwd(), opt.vmRootpath),
      macro: opt.macro,
      template: String(file.contents)
    };

    opt.verbose && console.log(PLUGIN_NAME + ' rendering template: ' + file.path);
    var context = getMock(file.path, path.join(process.cwd(), opt.vmRootpath), opt.mockRootpath);
    var result = new Engine(config).render(context);

    file.contents = new Buffer(result);
    file.path = gutil.replaceExtension(file.path, opt.outputExt || '.html');

    this.push(file);
    cb();
  }

  return through.obj(transform);
};
