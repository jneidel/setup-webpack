const path = require( "path" );
const { pug } = require( "../.." );

// Run: $ npm run pug-data

module.exports = {
  mode  : "development",
  entry : "./examples/src/bundles/pug-data.bundle.js",
  output: {
    path    : path.resolve( __dirname, "../build/js" ),
    filename: "app.js",
  },
  module: {
    rules: [ pug( "../html/pug-data.html", { h1: "Passed headline" } ) ],
  },
  optimization: {
    minimize: true,
  },
}
