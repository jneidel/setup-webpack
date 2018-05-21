const path = require( "path" );
const { md } = require( "../.." );

// Run: $ npm run md

module.exports = {
  mode  : "development",
  entry : "./examples/src/bundles/markdown.bundle.js",
  output: {
    path    : path.resolve( __dirname, "../build/js" ),
    filename: "md.js",
  },
  module: {
    rules: [ md( "../html/markdown.html" ) ],
  },
  optimization: {
    minimize: true,
  },
};
