const path = require( "path" );
const { genScss } = require( "../.." );

// Run: $ npm run scss

const scss = genScss( "../css/app.css" );

module.exports = {
  mode  : "development",
  entry : "./examples/src/bundles/app.bundle.js",
  output: {
    path    : path.resolve( __dirname, "../build/js" ),
    filename: "app.js",
  },
  module: {
    rules: [ scss.rule ],
  },
  plugins: [
    scss.plugin,
  ],
  optimization: {
    minimizer: [ scss.minimizer ],
  },
};
