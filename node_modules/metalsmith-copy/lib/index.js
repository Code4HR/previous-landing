var debug = require('debug')('metalsmith-copy'),
    path = require('path'),
    cloneDeep = require('lodash').cloneDeep;
    minimatch = require('minimatch');

module.exports = plugin;

function plugin(options) {
  return function(files, metalsmith, done) {
    if (!options.directory && !options.extension && !options.transform) return done(new Error('metalsmith-copy: "directory" or "extension" option required'));

    var matcher = minimatch.Minimatch(options.pattern);

    Object.keys(files).forEach(function (file) {
      debug('checking file: ' + file);
      if (!matcher.match(file)) return;

      var newName = file;

      // transform filename
      if (options.transform) {
        newName = options.transform(file);
      } else {
        if (options.extension) {
          var currentExt = path.extname(file);
          newName = path.join(path.dirname(file), path.basename(file, currentExt) + options.extension);
        }
        if (options.directory) {
          newName = path.join(options.directory, path.basename(newName));
        }
      }

      if (files[newName]) return done(new Error('metalsmith-copy: copying ' + file + ' to ' + newName + ' would overwrite file'));

      debug('copying file: ' + newName);
      files[newName] = cloneDeep(files[file]);
    });

    done();
  }
}
