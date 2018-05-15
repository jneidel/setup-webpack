const pathModule = require( "path" );
const browserSyncPlugin = require( "browser-sync-webpack-plugin" );
const MiniCssExtractPlugin = require( "mini-css-extract-plugin" );
const OptimizeCSSAssetsPlugin = require( "optimize-css-assets-webpack-plugin" );

// Rules (Loaders)
exports.babel = {
  test: /\.js$/,
  use : {
    loader : "babel-loader",
    options: {
      presets: [ "babel-preset-env", "minify" ],
    },
  },
};

exports.pug = ( path ) => ( {
  test: /\.pug/,
  use : [
    `file-loader?name=${path}`,
    "extract-loader",
    "html-loader",
    "pug-html-loader",
  ],
} );

const genScss = ( path ) => ( {
  rule: {
    test: /(\.scss|\.sass)$/,
    use : [
      MiniCssExtractPlugin.loader,
      "css-loader",
      "sass-loader",
    ],
  },
  minimizer: new OptimizeCSSAssetsPlugin( {} ),
  plugin   : new MiniCssExtractPlugin( { filename: path } ),
} );

exports.genScss = genScss;
exports.genSass = genScss;

// Plugins
exports.browserSync = ( proxy = 8000, port = 8080 ) =>
  new browserSyncPlugin( {
    host : "localhost",
    port,
    proxy: `http://localhost:${proxy}/`,
  }, {} );

// Functions
exports.polyfill = path => [ "babel-polyfill", path ];
