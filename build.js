// Metalsmith.io #############
// build a static HTML site from markdown and templates
// source files in ./source, final output files build into ./output
// needs Node.js 0.10.x to generate a site with "node build.js"

var Metalsmith  = require('metalsmith'),
    markdown    = require('metalsmith-markdown'),
    templates   = require('metalsmith-templates'),
    collections = require('metalsmith-collections'),
    permalinks  = require('metalsmith-permalinks'),
    watch       = require('metalsmith-watch'),
    drafts      = require('metalsmith-drafts'),
    Handlebars  = require('handlebars');

var livereload = true; // need dev/prod logic

var filecopy = function(from, to){
    return function(files, metalsmith, done){
        files[to] = files[from];
        delete files[from];
        done();
    };
};

Metalsmith(__dirname)
  .source('./source')  // where our editable markdown and templates go
  .destination('./output') // where prod files go. pushed to gh-pages branch
  .use(drafts()) // add "draft: true" to front-matter in .md files to make draft
  .use(collections({ // create arrays of document types for controlling later
    // p: {
    //   pattern: 'pages/*.md'
    //  },
    posts: {
      pattern: 'posts/*.md',
      sortBy: 'date',
      reverse: true
    }
  }))
  .use(markdown()) // our page/post engine for content writing
  .use(permalinks({ // help us create dir structure based on front-matter
    pattern: ':collection/:title'
  }))
  .metadata({
    partials: {
      header: 'header'
      // footer: 'footer'
    }
  })
  .use(templates({ // our temlates engine and location
    engine: 'handlebars',
    directory: 'templates'
    }))
  .use(filecopy('CNAMESRC', 'CNAME')) // manual file copy/rename
  .use(filecopy('README.md', 'README.md'))  // info for gh-pages branch
  // .use(watch({  // only used in development for a always running live reload server
  //     pattern : '**/*',
  //     livereload: livereload
  //   }))
  .build(function(err) {if (err) throw err;})  //do our build and finish
