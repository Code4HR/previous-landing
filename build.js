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
    assets      = require('metalsmith-assets'),
    redirect    = require('metalsmith-redirect'),
    sitemap     = require('./metalsmith-sitemap'), // https://github.com/ExtraHop/metalsmith-sitemap
    date        = require('metalsmith-build-date'),
    Handlebars  = require('handlebars');

// used to copy a file and rename at the same time
var filecopy = function(from, to){
    return function(files, metalsmith, done){
        files[to] = files[from];
        delete files[from];
        done();
    };
};

Metalsmith(__dirname)
  .source('./src')  // where our editable markdown and templates go
  .destination('./build') // where prod files go. pushed to gh-pages branch
  .use(drafts()) // add "draft: true" to front-matter in .md files to make draft
  .use(collections({ // create arrays of document types for controlling later
    posts: {
      pattern: 'posts/*.md',
      sortBy: 'date',
      reverse: true
    }
  }))
  .use(markdown()) // our page/post engine for content writing
  .use(permalinks({ // help us create dir structure based on front-matter
    pattern: ':collection/:stub'
  }))
  .metadata({
    partials: {  //reusable handlbar html parts
      header: 'header',
      footer: 'footer',
      navbar: 'navbar'
    }
  })
  .use(assets({
    source: './assets', // relative to the working directory
    destination: './' // relative to the build directory
  }))
  // .use(sitemap({
  //   ignoreFiles: [/(.*.png)|(.*.gif)|(.*.jpg)|(.*.css)|(.*.xml)|(.*.js)|(.*.ico)|(.*.txt)|(.DS_Store)/], // Matched files will be ignored
  //   output: 'sitemap.xml', // The location where the final sitemap should be placed
  //   urlProperty: 'path', // Key for URL property
  //   hostname: 'http://codeforhamptonroads.org/',
  //   modifiedProperty: 'modified', // Key for last modified property
  //   changefreq: 'changefreq',  // always hourly daily weekly monthly yearly never
  //   priority: 'priority', // from 0.0 to 1.0
  //   defaults: { // You can provide default values for any property in here
  //       priority: 0.5,
  //       changefreq: 'weekly'
  //   }
  // }))
  // .use(redirect({  // create any redirects, source: destination
  //   '/subfolder': 'http://anyurl.com',
  //   '/about-us': '/#about',
  // }))
  .use(templates({ // our temlates engine and location
    engine: 'handlebars',
    directory: 'templates'
    }))
  // .use(filecopy('CNAMESRC', 'CNAME')) // manual file copy/rename
  // .use(filecopy('README.md', 'README.md'))  // info for gh-pages branch
  .build(function(err) { //do our build and finish
    if (err) throw err;
    console.log("Done building Metalsmith");
  });
