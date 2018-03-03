const path = require( "path" );
const { scss, bundleCss, babel, uglify, minify, browserSync } = require( "../../index" );

// Run: $ npm run start

require( "dotenv" ).config( { path: "vars.env" } );

const prod = process.env.NODE_ENV === "prod";

const sync = browserSync( 8000, 8080 );

const config = {
  module: {
    loaders: prod ?
      [ babel, scss ] :
      [ scss ],
  },
};

const result = [];

[ "app", "help" ].forEach( ( name ) => {
  result.push( Object.assign( {}, config, {
    entry : `./examples/src/bundles/${name}.bundle.js`,
    output: {
      path    : path.resolve( __dirname, "build/js" ),
      filename: `${name}.js`,
    },
    plugins: prod ?
      [ minify, uglify, bundleCss( name ) ] :
      [ bundleCss( name ), sync ],
  } ) );
} );

module.exports = result;
