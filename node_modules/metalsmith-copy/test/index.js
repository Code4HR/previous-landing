var assert = require('assert'),
    dir_equal = require('assert-dir-equal'),
    metalsmith = require('metalsmith'),
    collections = require('metalsmith-collections'),
    copy = require('..');

function copy_test(options, fn) {
  // build callback can be called multiple times if an error condition occurs
  var once = false;

  metalsmith('test/fixtures/simple').use(copy(options)).build(function(err, files) {
    if (once) return;
    once = true;
    fn(err, files);
  })
}

describe('metalsmith-copy', function() {
  it('should copy and change the extension', function(done) {
    copy_test({
        pattern: '*.md',
        extension: '.text'
      }, function(err, files) {
        if (err) return done(err);
        assert(files['index.text'], 'file was copied');
        done();
      });
  });

  it('should copy and change the directory', function(done) {
    copy_test({
        pattern: '*.md',
        directory: 'out'
      }, function(err, files) {
        if (err) return done(err);
        assert(files['out/index.md'], 'file was copied');
        done();
      });
  });

  it('should copy and change both the directory and extension', function(done) {
    copy_test({
        pattern: '*.md',
        extension: '.text',
        directory: 'out'
      }, function(err, files) {
        if (err) return done(err);
        assert(files['out/index.text'], 'file was copied');
        done();
      });
  });

  it('should not copy files not matching the pattern', function(done) {
    copy_test({
        pattern: '*.mkd',
        extension: '.text'
      }, function(err, files) {
        if (err) return done(err);
        assert(!files['index.text'], 'file was not copied');
        done();
      });
  });

  it('should transform files using provided function', function(done) {
    copy_test({
        pattern: '*.md',
        transform: function(file) {
          return file + '.bak';
        }
      }, function(err, files) {
        if (err) return done(err);
        assert(files['index.md.bak'], 'file was copied');
        done();
      });
  });

  describe('error handling', function() {
    it('should not overwrite files that already exist', function(done) {
      copy_test({
          pattern: '*.md',
          extension: '.md'
        }, function(err, files) {
          if (err) return done();
          done(new Error('overwrote file'));
        });
    });

    it('should fail if no valid options are specified', function(done) {
      copy_test({
          pattern: '*.md'
        }, function(err) {
          assert(err, 'failed when incorrect options were specified');
          done();
        });
    });

      // if the copy was shallow, collections would mark the file with extension .md as part of the articles collection and that value would be shared to the copy, the file with extension .text, so make sure that the collection only contains 1 file if collections executes after the copy
    it('should do a deep copy of the file', function(done) {
      var m = metalsmith('test/fixtures/simple');

      m.use(copy({
        pattern: '*.md',
        extension: '.text'
      })).use(collections({
        articles: {
          pattern: "*.md"
        }
      })).build(function(err) {
        if (err) return done(err);
        assert(m.metadata().articles.length == 1, 'changes made to original file were incorrectly propogated to copy');
        done();
      });
    });
  });
});

