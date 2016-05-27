'use strict';

var through = require('through2');
var path = require('path');
var gutil = require('gulp-util');
var PluginError = gutil.PluginError;
var File = gutil.File;
var JsBeautify = require('js-beautify');
var Concat = require('concat-with-sourcemaps');

// file can be a vinyl file object or a string
// when a string it will construct a new one
module.exports = function(file, opt) {
  
  if (!file) {
    throw new PluginError('gulp-concat', 'Missing file option for gulp-concat');
  }
  opt = opt || {};

  // to preserve existing |undefined| behaviour and to introduce |newLine: ""| for binaries
  if (typeof opt.newLine !== 'string') {
    opt.newLine = gutil.linefeed;
  }

  if (!opt.manifest) {
    opt.manifest = 'js-rev-manifest.json';
  }

  var files = [];
  var dirMap = {};

  function bufferContents(file, enc, cb) {
    // ignore empty files
    if (file.isNull()) {
      cb();
      return;
    }

    // we don't do streams (yet)
    if (file.isStream()) {
      this.emit('error', new PluginError('gulp-concat',  'Streaming not supported'));
      cb();
      return;
    }

    var dir = path.dirname(file.path);
    var name = path.basename(file.path);

    if (!dirMap[dir]) {
      dirMap[dir] = [];
    }

    dirMap[dir].push(name);
    files[file.path] = file;

    cb();
  }

  function endStream(cb) {

    for (let dir in dirMap) {

        let isUsingSourceMaps = false;
        let firstFile = files[path.join(dir, dirMap[dir][0])];
        let joinedFile = firstFile.clone({contents: false});
        
        joinedFile.path = path.join(dir, dirMap[dir].join(','));

        if (firstFile.sourceMap && isUsingSourceMaps === false) {
          isUsingSourceMaps = true;
        }

        let concat = new Concat(isUsingSourceMaps, file, opt.newLine);
        
        for (let i in dirMap[dir]) {
          let item = files[path.join(dir, dirMap[dir][i])];
          concat.add(item.relative, item.contents, item.sourceMap);
        }

        if (concat.sourceMapping) {
          joinedFile.sourceMap = JSON.parse(concat.sourceMap);
        }

        joinedFile.contents = concat.content;
        this.push(joinedFile);
    }

    var manifest = {};
    
    for (let name in files) {
      let dir = path.dirname(name);
      let relative = files[name].relative;

      //需要对文件名unrev
      manifest[files[name].relative.replace(/\-[a-z0-9]*/, '')] = path.join(path.dirname(files[name].relative), dirMap[dir].join(','))
    }

    var content = JsBeautify.js_beautify(JSON.stringify(manifest).replace(/\\\\/g, '/'));

    var manifestFile = new File({
      path: opt.manifest,
      contents: new Buffer(content)
    });

    this.push(manifestFile);

    cb();
  }

  return through.obj(bufferContents, endStream);
};