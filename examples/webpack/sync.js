const path = require( "path" );
const { browserSync } = require( "../../index" );

// Run: $ npm run sync

const sync = browserSync( 8000, 8080 );

module.exports = {
  entry : "./examples/src/bundles/js.bundle.js",
  output: {
    path    : path.resolve( __dirname, "../build/js" ),
    filename: "app.js",
  },
  plugins: [ sync ],
};
