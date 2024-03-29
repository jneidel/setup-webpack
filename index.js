const pathModule = require( "path" );
const browserSyncPlugin = require( "browser-sync-webpack-plugin" );
const MiniCssExtractPlugin = require( "mini-css-extract-plugin" );
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");

/* Rules (Loaders) */
exports.babel = {
  test: /\.m?js$/,
  exclude: /(node_modules)/,
  use : {
    loader : "babel-loader",
    options: {
      presets: [ "@babel/preset-env", "babel-preset-minify" ],
      plugins: [ "@babel/plugin-transform-runtime" ],
    },
  },
};

exports.md = ( path, gfm = null, style = null, border = null, js = null ) => ( {
  test: /\.md$/,
  use : [
    `file-loader?name=${path}`,
    `gfm-loader?gfm=${gfm}&style=${style}&border=${border}&js=${js}`,
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
  minimizer: new CssMinimizerPlugin(),
  plugin   : new MiniCssExtractPlugin( { filename: path } ),
  rule     : scssLoader,
  font     : {
    test   : /\.(ttf|otf)$/,
    loader : "file-loader",
    options: {
      name: `${pathModule.dirname( path )}/[name][ext]`,
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
    name: `${path}/[name][ext]`,

    esModule: false,
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
exports.polyfill = path => [ "@babel/polyfill", path ];
