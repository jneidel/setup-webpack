const path = require( "path" );
const { babel, polyfill } = require( "../.." );

// Run: $ npm run prod

module.exports = {
  mode  : "production",
  entry : polyfill( "./examples/src/bundles/js.bundle.js" ), // Bundle only includes js file
  // Wrap bundle in a polyfill function to polyfill ES6 functions
  output: {
    path    : path.resolve( __dirname, "../build/js" ),
    filename: "app.js",
  },
  module: {
    rules: [ babel ], // Transpiling happens here
  },
  optimization: {
    minimize: true, // And minfiying here
  },
};
