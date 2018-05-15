const path = require( "path" );
const { genScss, pug, babel, browserSync, polyfill } = require( "../.." );

// Run: $ npm run complete

require( "dotenv" ).config( { path: "examples/webpack/vars.env" } );
const prod = process.env.NODE_ENV === "prod";

const sync = browserSync( 8000, 8080 );

const result = []; // Exported webpack config can be an obj or an array of objects

// Array of files to be build, e.g. different routes
[ "app", "help" ].forEach( ( name ) => {
  const scss = genScss( `../css/${name}.css` );

  const entryPath = `./examples/src/bundles/${name}.bundle.js`;
  const pugName = name === "app" ? `../index.html` : `../html/${name}.html`; // So that the server serves a default page when browser-sync opens a new tab

  result.push( {
    mode  : prod ? "production" : "development",
    entry : prod ? polyfill( entryPath ) : entryPath,
    output: {
      path    : path.resolve( __dirname, "../build/js" ),
      filename: `${name}.js`,
    },
    module: {
      rules: prod ?
        [ scss.rule, pug( pugName ), babel ] :
        [ scss.rule, pug( pugName ) ],
    },
    plugins: prod ?
      [ scss.plugin ] :
      [ scss.plugin, sync ],
    optimization: {
      minimize : true,
      minimizer: [ scss.minimizer ],
    },
  } );
} );

module.exports = result; // Export the array of config objects
