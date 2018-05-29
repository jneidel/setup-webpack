const path = require( "path" );
const { img, pug, genScss } = require( "../.." );

// Run: $ npm run font

/**
 * The entrypoint file requires .pug/.scss files which import local imgs
 * See: ../src/scss/img.scss & ../src/pug/img.pug
 */

const scss = genScss( "../css/img.css" );

module.exports = {
  mode  : "development",
  entry : "./examples/src/bundles/img.bundle.js",
  output: {
    path    : path.resolve( __dirname, "../build/js" ),
    filename: "img.js", // Empty img.js file
  },
  module: {
    rules: [
      scss.rule,
      pug( "../html/img.html" ),
      img( "../img" ), // Only give the directory, not the file name,
      // which will be copied over, i.e. github.png and canvas-orange.png
    ],
  },
  plugins: [ scss.plugin ],
};
