const pathModule = require( "path" );
const browserSyncPlugin = require( "browser-sync-webpack-plugin" );
const MiniCssExtractPlugin = require( "mini-css-extract-plugin" );
const OptimizeCSSAssetsPlugin = require( "optimize-css-assets-webpack-plugin" );

/* Rules (Loaders) */
exports.babel = {
  test: /\.js$/,
  use : {
    loader : "babel-loader",
    options: {
      presets: [ "babel-preset-env", "minify" ],
    },
  },
};

exports.md = ( path, gfm = null, style = null, border = null ) => ( {
  test: /\.md$/,
  use : [
    `file-loader?name=${path}`,
    `gfm-loader?gfm=${gfm}&style=${style}&border=${border}`,
    "extract-loader",
    "html-loader",
    "markdown-loader",
  ] } );

// Scss
const scssLoader = {
  test: /\.(scss|sass)$/,
  use : [
    MiniCssExtractPlugin.loader,
    "css-loader",
    "sass-loader",
  ],
};

const genScss = path => ( {
  minimizer: new OptimizeCSSAssetsPlugin( {} ),
  plugin   : new MiniCssExtractPlugin( { filename: path } ),
  rule     : scssLoader,
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

// Pug
exports.pug = ( path, data = {} ) => ( {
  test: /\.pug$/,
  use : [
    `file-loader?name=${path}`,
    "extract-loader",
    "html-loader",
    {
      loader: "pug-html-loader",
      options: {
        data,
      }
    }
  ],
} );

// Image loader
exports.img = path => ( {
  test   : /\.(png|jpg|jpeg|ico|svg)$/,
  loader : "file-loader",
  options: {
    name: `${path}/[name].[ext]`,
  },
} );

/* Plugins */
exports.browserSync = ( proxy = 8000, port = 8080 ) =>
  new browserSyncPlugin( {
    host : "localhost",
    port,
    proxy: `http://localhost:${proxy}/`,
  }, {} );

/* Functions */
exports.polyfill = path => [ "babel-polyfill", path ];
