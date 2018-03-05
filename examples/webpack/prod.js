const path = require( "path" );
const { uglify, babel, polyfill } = require( "../../index" );

// Run: $ npm run prod

module.exports = {
  entry : polyfill( "./examples/src/bundles/js.bundle.js" ),
  output: {
    path    : path.resolve( __dirname, "../build/js" ),
    filename: "app.js",
  },
  module: {
    loaders: [ babel ],
  },
  plugins: [ uglify ],
};
