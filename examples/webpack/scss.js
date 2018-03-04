const path = require( "path" );
const { scss, bundleCss } = require( "../../index" );

// Run: $ npm run babel

module.exports = {
  entry : "./examples/src/bundles/app.bundle.js",
  output: {
    path    : path.resolve( __dirname, "../build/js" ),
    filename: "app.js",
  },
  module: {
    loaders: [ scss ],
  },
  plugins: [ bundleCss( "../css/app.css" ) ],
};
