const path = require( "path" );
const { genPug } = require( "../../index" );

// Run: $ npm run pug

const pug = genPug( "../index.html" );

module.exports = {
  entry : "./examples/src/bundles/pug.bundle.js",
  output: {
    path    : path.resolve( __dirname, "../build/js" ),
    filename: "app.js",
  },
  module: {
    loaders: [ pug.loader ],
  },
  plugins: [ pug.plugin ],
};
