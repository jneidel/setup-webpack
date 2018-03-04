const path = require( "path" );
const { uglify, minify, babel } = require( "../../index" );

// Run: $ npm run prod

module.exports = {
  entry : "./examples/src/bundles/js.bundle.js",
  output: {
    path    : path.resolve( __dirname, "../build/js" ),
    filename: "app.js",
  },
  module: {
    loaders: [ babel ],
  },
  plugins: [ uglify, minify ],
};
