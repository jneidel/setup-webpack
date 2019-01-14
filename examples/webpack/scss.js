const path = require( "path" );
const { genScss, pug } = require( "../.." );

// Run: $ npm run scss

const scss = genScss( "../css/app.css" ); // Set output path for css file
// This path is relative to the one set in the 'outputPath' variable (in this case build/)
// So the file will be saved as 'build/app.css'

module.exports = {
  mode  : "development",
  entry : "./examples/src/bundles/app.bundle.js",
  output: {
    path    : path.resolve( __dirname, "../build/js" ),
    filename: "app.js",
    // Will create an empty 'build/app.js' file, as no javascript is required in 'bundle.js'
  },
  module: { // Transpiling to css happens here
    rules: [ scss.rule, pug( "../index.html" ) ],
  },
  plugins     : [ scss.plugin ], // Saves css to file
  optimization: { // If mode set to 'production' use scss minimizer
    minimizer: [ scss.minimizer ],
  },
};
