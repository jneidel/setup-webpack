# setup-webpack

> Opinionated collection of webpack plugins and loaders with explanations of common use cases

[![](https://img.shields.io/badge/license-MIT-green.svg)](https://github.com/jneidel/setup-webpack/blob/master/licence)
[![](https://img.shields.io/npm/dw/setup-webpack.svg)](https://www.npmjs.com/package/setup-webpack)

Reduce boilerplate creating your webpack config and keep your package.json slim.

## Install

[![](https://img.shields.io/npm/v/setup-webpack.svg)](https://www.npmjs.com/package/setup-webpack)

```
$ npm install setup-webpack
```

## Usage

**webpack.config.js:**

```js
const { scss, bundleCss, babel, minify, uglify, browserSync } = require( "setup-webpack" );

const sync = browserSync( 8000, 8080 );

module.exports = {
  entry : "./app.bundle.js",
  output: {
    path    : path.resolve( __dirname, "build" ),
    filename: "app.js",
  },
  module: {
    loaders: [ babel, scss ],
  },
  plugins: [ minify, uglify, bundleCss( "../app.css" ), sync ],
};
```

## Usage Patterns

All working examples can be found in the `examples/webpack` folder.

Clone the repo to follow along with the examples:

```
$ git clone https://github.com/jneidel/setup-webpack.git
```

These conceptual examples will be using a simlified setup:

```
 ├── webpack.config.js
 ├── bundle.js
 ├── app.js
 ├── app.scss
 └── build/
```

`webpack.config.js` is where we'll be working.
`bundle.js` is the entry point for webpack and will require `app.js` and `app.scss`, which are just sample files.
`build/` is where webpack will generate our output.

### Compile scss to css

Transform scss to css.

Working example at `examples/webpack/scss.js`.

**webpack.config.js:**

```js
const { scss, bundleCss } = require( "setup-webpack" );

module.exports = {
  // Entry and output are required for webpack to work
  entry : "./bundle.js", // Bundle only includes scss file
  output: {
    path: path.resolve( __dirname, "build" ),
    filename: "app.js",
    // Will create an empty app.js file, as no javascript is required in bundle.js
  },
  module: { // Compiling happens here
    loaders: [ scss ],
  },
  plugins: [ bundleCss( "app.css" ) ],
  // File will be saved at build/app.css, using the path set in output.path
}
```

### Compress and transpile ES6+

Reduce file size using uglify/minify and transpile ES6+ for older browsers.

Working example at `examples/webpack/prod.js`.

**webpack.config.js:**

```js
const { babel, uglify, minify } = require( "setup-webpack" );

module.exports = {
  entry : "./bundle.js", // Bundle only includes js file
  output: {
    path    : path.resolve( __dirname, "build" ),
    filename: "app.js",
  },
  module: { // Transpiling happens here
    loaders: [ babel ],
  }, // And compression and minfiying here
  plugins: [ minify, uglify ],
};
```

### Reload browser on changes

Any changes on the files include in the `bundle.js` will cause a rebuild and reload of the browser.

Working example at `examples/webpack/sync.js`.

**webpack.config.js:**

```js
const { browserSync } = require( "setup-webpack" );

const sync = browserSync( 8000, 8080 );
// Declaring sync as a variable works best

module.exports = {
  entry : "./bundle.js", // Bundle only includes js file
  output: {
    path    : path.resolve( __dirname, "build" ),
    filename: "app.js",
  },
  plugins: [ sync ],
};
```

The script has to run webpack in watch (-w) mode for browser-sync to be triggerd once webpack has rebuilt.

```
$ webpack -w
```

### Differentiate between development and production env

Using environmental variables compression and transpiling will only be triggerd in a production evironment.

Working example at `examples/webpack/env.js`

**webpack.config.js:**

```js
const { scss, bundleCss, babel, uglify, minify, browserSync } = require( "setup-webpack" );

require( "dotenv" ).config( { path: "vars.env" } ); // Import env variables

const prod = process.env.NODE_ENV === "prod";

const sync = browserSync( 8000, 8080 );

module.exports = {
  entry : "./app.js",
  output: {
    path    : path.resolve( __dirname, "build" ),
    filename: "app.js",
  },
  module: {
    loaders: prod ?
      [ babel, scss ] : // Transpile if prod
      [ scss ], // Else only compile scss
  },
  plugins: prod ?
    [ minify, uglify, bundleCss( "app.css" ) ] : // Compress if prod
    [ bundleCss( "app.css" ), sync ], // Else compile scss and watch for changes
    // Put sync at the end as your browser should reload after done is built
};
```

### Generating more than one output file

Working example at `examples/webpack/complete.js`

**webpack.config.js:**

```js
const { scss, bundleCss, babel, uglify, minify, browserSync } = require( "setup-webpack" );

require( "dotenv" ).config( { path: "vars.env" } );

const prod = process.env.NODE_ENV === "prod";

const sync = browserSync( 8000, 8080 );

const config = { // Create config object as common base for all files
  module: {
    loaders: prod ?
      [ babel, scss ] :
      [ scss ],
  },
};

const result = []; // Exported webpack config can be a obj or an array of objects

// Array of files to be build, e.g. different routes
[ "app", "help" ].forEach( ( name ) => {
  result.push( Object.assign( {}, config, { // Combine base config with specific data
    entry : `./${name}.js`,
    output: {
      path    : path.resolve( __dirname, "build" ),
      filename: `${name}.js`,
    },
    plugins: prod ?
      [ minify, uglify, bundleCss( `${name}.css` ) ] :
      [ bundleCss( `${name}.css` ), sync ],
  } ) );
} );

module.exports = result;
```

## API

Cherry-pick the parts that you need using object destructuring:

```js
const { scss, babel, minify } = require( "setup-webpack" );
```

### scss

Type: `object` 

Unit: `loader`

Extracts scss from the javascript entry file and compiles it to css.

```js
const { scss } = require( "setup-webpack" );

module.exports = {
  module: {
    loaders: [ scss ]
  },
}
```

Using [extract-text-webpack-plugin](https://www.npmjs.com/package/extract-text-webpack-plugin), [raw-loader](https://www.npmjs.com/package/raw-loader), [sass-loader](https://www.npmjs.com/package/sass-loader), [node-sass](https://www.npmjs.com/package/node-sass) underneath.

### bundleCss( name )

Type: `function`

Unit: `plugin`

Writes previously via `scss` extracted css data to file.

#### name

Type: `string`

Location where the new css file should be written. Path is relative to the `output.path`.

```js
const { scss, bundleCss } = require( "setup-webpack" );

module.exports = {
  output: {
    path: path.resolve( __dirname, "build" ),
  },
  module: {
    loaders: [ scss ]
  },
  plugins: [ bundleCss( "app.css" ) ], // Written as build/app.css
}
```
          
Using [extract-text-webpack-plugin](https://www.npmjs.com/package/extract-text-webpack-plugin) underneath.

### babel

Type: `object`

Unit: `loader`

Transpiling ES6+ javascript for older browsers, [more](https://babeljs.io/).

```js
const { babel } = require( "setup-webpack" );

module.exports = {
  module: {
    loaders: [ babel ]
  }
}
```

Using [babel-loader](https://www.npmjs.com/package/babel-loader), [babel-preset-env](https://www.npmjs.com/package/babel-preset-env), [babel-core](https://www.npmjs.com/package/babel-core) underneath.

### browserSync( [proxy], [port] )

Type: `function`

Unit: `plugin`

Reloads browers windows connected on given port after webpack rebuilt the resources.

The proxy as well as the port are using localhost.

#### [proxy]

Optional

Type: `number`

Default: `8000`

Describes the port your app is running on.

#### [port]

Optional

Type: `number`

Default: `8080`

Describes the port browser-sync will be running on. Only browser tabs connected to this port will be reloaded.

Using [browser-sync](https://www.npmjs.com/package/browser-sync), [browser-sync-webpack-plugin](https://www.npmjs.com/package/browser-sync-webpack-plugin) underneath.

### minify

Type: `object`

Unit: `plugin`

Shrinks down files, removing whitespace, redundant characters, [more](https://babeljs.io/blog/2016/08/30/babili).

```js
const { minify } = require( "setup-webpack" );

module.exports = {
  plugins: [ minify ]
}
```

Using [babel-minify-webpack-plugin](https://www.npmjs.com/package/babel-minify-webpack-plugin) underneath.

### uglify

Type: `object`

Unit: `plugin`

Compresses, minifies files, [more](https://github.com/mishoo/UglifyJS2).

```js
const { uglify } = require( "setup-webpack" );

module.exports = {
  plugins: [ uglify ]
}
```

Using [webpack](https://www.npmjs.com/package/webpack).optimize.UglifyJsPlugin underneath.

## License

MIT © [Jonathan Neidel](https://github.com/jneidel)
