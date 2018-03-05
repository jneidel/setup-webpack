const path = require( "path" );
const { genScss, babel, uglify, minify, browserSync } = require( "../../index" );

// Run: $ npm run complete

require( "dotenv" ).config( { path: "vars.env" } );

const prod = process.env.NODE_ENV === "prod";

const sync = browserSync( 8000, 8080 );

const result = [];

[ "app", "help" ].forEach( ( name ) => {
  const scss = genScss( `../css/${name}.css` );

  result.push( {
    entry : `./examples/src/bundles/${name}.bundle.js`,
    output: {
      path    : path.resolve( __dirname, "../build/js" ),
      filename: `${name}.js`,
    },
    module: {
      loaders: prod ?
        [ babel, scss.loader ] :
        [ scss.loader ],
    },
    plugins: prod ?
      [ minify, uglify, scss.plugin ] :
      [ scss.plugin, sync ],
  } );
} );

module.exports = result;
