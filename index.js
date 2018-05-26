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

exports.md = ( path, href = "" ) => ( {
  test: /\.md$/,
  use : [
    `file-loader?name=${path}`,
    `gfm-loader?href=${href}`,
    "extract-loader",
    "html-loader",
    "markdown-loader",
  ] } );

const genScss = path => ( {
  rule: {
    test: /\.(scss|sass)$/,
    use : [
      MiniCssExtractPlugin.loader,
      "css-loader",
      "sass-loader",
    ],
  },
  minimizer: new OptimizeCSSAssetsPlugin( {} ),
  plugin   : new MiniCssExtractPlugin( { filename: path } ),
  font     : {
    test   : /\.(ttf|otf)$/,
    loader : "file-loader",
    options: {
      name: `${pathModule.dirname( path )}/[name].[ext]`,
    },
  },
} );
exports.genScss = genScss;
exports.genSass = genScss;

exports.pug = path => ( {
  test: /\.pug$/,
  use : [
    `file-loader?name=${path}`,
    "extract-loader",
    "html-loader",
    "pug-html-loader",
  ],
} );

exports.genPug = path => ( {
  rule: { // Same as pug
    test: /\.pug$/,
    use : [
      `file-loader?name=${path}`,
      "extract-loader",
      "html-loader",
      "pug-html-loader",
    ],
  },
  img: {
    test   : /\.(png|jpg|jpeg|ico)$/,
    loader : "file-loader",
    options: {
      name: `${pathModule.dirname( path )}/[name].[ext]`,
    },
  },
} );

// Plugins
exports.browserSync = ( proxy = 8000, port = 8080 ) =>
  new browserSyncPlugin( {
    host : "localhost",
    port,
    proxy: `http://localhost:${proxy}/`,
  }, {} );

// Functions
exports.polyfill = path => [ "babel-polyfill", path ];
