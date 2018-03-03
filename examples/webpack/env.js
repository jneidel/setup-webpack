const path = require( "path" );
const { scss, bundleCss, babel, uglify, minify, browserSync } = require( "../../index" );

// Run: $ npm run babel

require( "dotenv" ).config( { path: "vars.env" } );

const prod = process.env.NODE_ENV === "prod";

const sync = browserSync( 8000, 8080 );

module.exports = {
  entry : "./examples/src/bundles/app.bundle.js",
  output: {
    path    : path.resolve( __dirname, "build/js" ),
    filename: "app.js",
  },
  module: {
    loaders: prod ?
      [ babel, scss ] :
      [ scss ],
  },
  plugins: prod ?
    [ minify, uglify, bundleCss( "../css/app.css" ) ] :
    [ bundleCss( "../css/app.css" ), sync ],
};
