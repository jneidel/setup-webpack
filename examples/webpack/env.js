const path = require( "path" );
const { genScss, babel, browserSync, pug } = require( "../.." );

// Run: $ npm run env

require( "dotenv" ).config( { path: "examples/webpack/vars.env" } ); // Import env variables

const prod = process.env.NODE_ENV === "prod";

const sync = browserSync( 8000, 8080 );

const scss = genScss( "../css/app.css" );
const htmlOut = "../html/env.html";

module.exports = {
  mode  : prod ? "production" : "development",
  entry : "./examples/src/bundles/app.bundle.js",
  output: {
    path    : path.resolve( __dirname, "../build/js" ),
    filename: "app.js",
  },
  module: {
    rules: prod ?
      [ babel, scss.rule, pug( htmlOut ) ] : // Transpile js, scss, pug if prod
      [ scss.rule, pug( htmlOut ) ], // Else only transpile scss and pug
  },
  plugins: prod ?
    [ scss.plugin ] : // Only save css if prod
    [ scss.plugin, sync ], // Else also run browser-sync server
  optimization: {
    minimize : true,
    minimizer: [ scss.minimizer ],
  },
};
