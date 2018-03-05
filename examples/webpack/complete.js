const path = require( "path" );
const { genScss, genPug, babel, uglify, browserSync } = require( "../../index" );

// Run: $ npm run complete

require( "dotenv" ).config( { path: "examples/webpack/vars.env" } );

const prod = process.env.NODE_ENV === "prod";

const sync = browserSync( 8000, 8080 );

const result = [];

[ "app", "help" ].forEach( ( name ) => {
  const scss = genScss( `../css/${name}.css` );
  const pug = genPug( `../html/${name}.html` );

  result.push( {
    entry : `./examples/src/bundles/${name}.bundle.js`,
    output: {
      path    : path.resolve( __dirname, "../build/js" ),
      filename: `${name}.js`,
    },
    module: {
      loaders: prod ?
        [ babel, scss.loader, pug.loader ] :
        [ scss.loader, pug.loader ],
    },
    plugins: prod ?
      [ uglify, scss.plugin, pug.plugin ] :
      [ scss.plugin, pug.plugin, sync ],
  } );
} );

module.exports = result;
