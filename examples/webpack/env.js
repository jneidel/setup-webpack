const path = require( "path" );
const { genScss, babel, uglify, minify, browserSync } = require( "../../index" );

// Run: $ npm run env

require( "dotenv" ).config( { path: "vars.env" } );

const prod = process.env.NODE_ENV === "prod";

const sync = browserSync( 8000, 8080 );

const scss = genScss( "../css/app.css" );

module.exports = {
  entry : "./examples/src/bundles/app.bundle.js",
  output: {
    path    : path.resolve( __dirname, "../build/js" ),
    filename: "app.js",
  },
  module: {
    loaders: prod ?
      [ babel, scss.loader ] :
      [ scss.loader ],
  },
  plugins: prod ?
    [ minify, uglify, scss.plugin ] :
    [ scss.plugin, sync ],
};
