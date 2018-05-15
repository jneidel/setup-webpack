const path = require( "path" );
const { pug } = require( "../.." );

// Run: $ npm run pug

module.exports = {
  mode  : "development",
  entry : "./examples/src/bundles/pug.bundle.js",
  output: {
    path    : path.resolve( __dirname, "../build/js" ),
    filename: "app.js",
  },
  module: {
    rules: [ pug( "../html/index.html" ) ],
  },
  optimization: {
    minimize: true,
  },
};
