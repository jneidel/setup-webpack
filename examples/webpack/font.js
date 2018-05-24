const path = require( "path" );
const { genScss } = require( "../.." );

// Run: $ npm run font

/**
 * The entrypoint file requires a .scss file which imports a local font file
 * See: ../src/scss/font.scss
 */

const scss = genScss( "../css/font.css" );
// Outputs font to same dir (../css/), copying over the name,
// in this case Quantify.ttf

module.exports = {
  mode  : "development",
  entry : "./examples/src/bundles/font.bundle.js",
  output: {
    path    : path.resolve( __dirname, "../build/js" ),
    filename: "font.js", // Empty font.js file
  },
  module: {
    rules: [ scss.rule, scss.font ],
  },
  plugins: [ scss.plugin ],
};
