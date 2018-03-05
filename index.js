const webpack = require( "webpack" );
const pathModule = require( "path" );
const minifyModule = require( "babel-minify-webpack-plugin" );
const extractTextPlugin = require( "extract-text-webpack-plugin" );
const browserSyncPlugin = require( "browser-sync-webpack-plugin" );

// Loaders
exports.babel = {
  test: /\.js$/,
  use : {
    loader : "babel-loader",
    options: {
      presets: [ "babel-preset-env", "minify" ],
    },
  },
};

// Generators
const genScss = ( path ) => {
  const plugin = new extractTextPlugin( path );
  const loader = {
    test  : /(\.scss|\.sass)$/,
    loader: plugin.extract( "raw-loader!sass-loader" ),
  };
  return { loader, plugin };
};
exports.genScss = genScss;
exports.genSass = genScss;

exports.genPug = ( path ) => {
  const plugin = new extractTextPlugin( path );
  const loader = {
    test  : /\.pug$/,
    loader: plugin.extract( "raw-loader!pug-html-loader" ),
  };
  return { loader, plugin };
};

// Plugins
exports.uglify = new webpack.optimize.UglifyJsPlugin( {
  compress: { warnings: false },
} );

exports.browserSync = ( proxy = 8000, port = 8080 ) =>
  new browserSyncPlugin( {
    host : "localhost",
    port,
    proxy: `http://localhost:${proxy}/`,
  }, {} );

// Functions
exports.polyfill = path => [ "babel-polyfill", path ];
