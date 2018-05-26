const path = require( "path" );
const { genPug } = require( "../.." );

// Run: $ npm run font

/**
 * The entrypoint file requires a .pug file which imports a local img file
 * See: ../src/pug/img.scss
 */

const pug = genPug( "../html/img.html" );
// Outputs images to same dir (../html/), copying over the name,
// in this case github.png

module.exports = {
  mode  : "development",
  entry : "./examples/src/bundles/img.bundle.js",
  output: {
    path    : path.resolve( __dirname, "../build/js" ),
    filename: "img.js", // Empty img.js file
  },
  module: {
    rules: [ pug.rule, pug.img ],
  },
};
