const path = require( "path" );
const { genScss } = require( "../../index" );

// Run: $ npm run scss

const scss = genScss( "../css/app.css" );

module.exports = {
  entry : "./examples/src/bundles/app.bundle.js",
  output: {
    path    : path.resolve( __dirname, "../build/js" ),
    filename: "app.js",
  },
  module: {
    loaders: [ scss.loader ],
  },
  plugins: [ scss.plugin ],
};
