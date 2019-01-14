const path = require( "path" );
const { browserSync } = require( "../.." );

// Run: $ npm run sync

const sync = browserSync( 8000, 8080 );
// Declaring sync as a variable works best
// 8000 specifies the port your server is running on

// browser-sync should only be used during development
module.exports = {
  mode  : "development",
  entry : "./examples/src/bundles/js.bundle.js",
  output: {
    path    : path.resolve( __dirname, "../build/js" ),
    filename: "app.js",
  },
  plugins: [ sync ],
  // Put sync at the end of your plugins that your browser reloads after the build has completed
};
