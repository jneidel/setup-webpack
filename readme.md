# setup-webpack

> Opinionated module of webpack plugins and loaders for simple setup with explanations of common use cases

[![](https://img.shields.io/badge/license-MIT-green.svg)](https://github.com/jneidel/setup-webpack/blob/master/licence)
[![](https://img.shields.io/npm/dw/setup-webpack.svg)](https://www.npmjs.com/package/setup-webpack)

Reduce boilerplate creating your webpack config and keep your package.json slim.

Includes abstractions for transforming scss and pug, transpiling and polyfill your javascript, minfication and reloading the browser on changes. All usage patterns described with clear examples.

## Install

[![](https://img.shields.io/npm/v/setup-webpack.svg)](https://www.npmjs.com/package/setup-webpack)

```
$ npm install setup-webpack
```

## Usage

**webpack.config.js:**

```js
const { babel, polyfill, uglify, browserSync, genScss, genPug } = require( "setup-webpack" );

const sync = browserSync( 8000, 8080 );

const scss = genScss( "app.css" );
const pug = genPug( "app.html" );

module.exports = {
  entry : polyfill( "./app.bundle.js" ),
  output: {
    path    : path.resolve( __dirname, "build" ),
    filename: "app.js",
  },
  module: {
    loaders: [ babel, scss.loader, pug.loader ],
  },
  plugins: [ uglify, scss.plugin, pug.plugin, sync ],
};
```

## Usage Patterns

All working examples can be found in the [`examples/webpack`](https://github.com/jneidel/setup-webpack/tree/master/examples/webpack) folder.

Clone the repo to follow along with the examples:

```
$ git clone https://github.com/jneidel/setup-webpack.git
```

These conceptual examples will be using a simlified setup:

```
 ├── webpack.config.js
 ├── bundle.js
 ├── src/
 │   ├── app.js
 │   ├── app.scss
 │   └── app.pug
 └── build/
```

`webpack.config.js` is where we'll be working.
`bundle.js` is the entry point for webpack and will require the files from the `src/` folder.
`build/` is where webpack will generate our output.

To avoid dublication the here defined output path will be use throughout all examples.

```js
const path = require( "path" );

const outputPath = path.resolve( __dirname, "build" );
```

### Transpile scss to css

Transform [scss](https://sass-lang.com/) or (sass) to css.

Working example at [`examples/webpack/scss.js`](https://github.com/jneidel/setup-webpack/blob/master/examples/webpack/scss.js).

**bundle.js:**

```js
require( "./src/app.scss" );
```

**webpack.config.js:**

```js
const { genScss } = require( "setup-webpack" );

const scss = genScss( "app.css" ) // Set output path for css file
// This path is relative to the one set in the 'outputPath' variable (in this case build/) 
// So the file will be saved as 'build/app.css'

module.exports = {
  // Entry and output are required for webpack to work
  entry : "./bundle.js",
  output: { path: outputPath, filename: "app.js", },
  // Will create an empty 'build/app.js' file, as no javascript is required in 'bundle.js'
  module: { // Transpiling happens here
    loaders: [ scss.loader ],
  },
  plugins: [ scss.plugin ],
}
```

### Transpile pug to html

Transform [pug](https://github.com/pugjs/pug) to html.

Working example at [`examples/webpack/pug.js`](https://github.com/jneidel/setup-webpack/blob/master/examples/webpack/pug.js).

Same syntax from scss applies.

**bundle.js:**

```js
require( "./src/app.pug" );
```

**webpack.config.js:**

```js
const { genPug } = require( "setup-webpack" );

const pug = genPug( "index.html" );

module.exports = {
  entry : "./bundle.js",
  output: { path: outputPath, filename: "app.js" },
  module: {
    loaders: [ pug.loader ],
  },
  plugins: [ pug.plugin ],
};
```

### Minify and transpile ES6+

Reduce file size using uglify/minify, polyfill and transpile ES6+ for older browsers using babel.

Working example at [`examples/webpack/prod.js`](https://github.com/jneidel/setup-webpack/blob/master/examples/webpack/prod.js).

**bundle.js:**

```js
require( "./src/app.js" );
```

**webpack.config.js:**

```js
const { babel, uglify } = require( "setup-webpack" );

module.exports = {
  entry : polyfill( "./bundle.js" ), // Bundle only includes js file
  // Wrap bundle in polyfill function to polyfill the given bundle
  output: { path: outputPath, filename: "app.js" },
  module: { // Transpiling happens here
    loaders: [ babel ],
  }, // And compression and minfiying here
  plugins: [ uglify ],
};
```

As this process takes some time you only want to run this in an production environment and not while developing.

### Differentiate between development and production env

Using environmental variables compression and transpiling will only be triggerd in a production evironment.

Working example at [`examples/webpack/env.js`](https://github.com/jneidel/setup-webpack/blob/master/examples/webpack/env.js).

**bundle.js:**

```js
require( "./src/app.js" );
require( "./src/app.scss" );
```

**webpack.config.js:**

```js
const { genScss, babel, uglify, browserSync, polyfill } = require( "setup-webpack" );

require( "dotenv" ).config( { path: "vars.env" } ); // Import env variables

const prod = process.env.NODE_ENV === "prod";

const sync = browserSync( 8000, 8080 );

const scss = genScss( "app.css" );

const entry = prod ? polyfill( "./app.js" ) : "./app.js";

module.exports = {
  entry,
  output: { path outputPath, filename: "app.js" },
  module: {
    loaders: prod ?
      [ babel, scss.loader ] : // Transpile js and scss if prod
      [ scss.loader ], // Else only transpile scss
  },
  plugins: prod ?
    [ uglify, scss.plugin ] : // Minify if prod
    [ scss.plugin ], // Else only transpile scss
};
```

### Reload browser on changes

Any changes on the files include in the `bundle.js` will cause a rebuild and reload of the browser.

Working example at [`examples/webpack/sync.js`](https://github.com/jneidel/setup-webpack/blob/master/examples/webpack/sync.js).

**webpack.config.js:**

```js
const { browserSync } = require( "setup-webpack" );

const sync = browserSync( 8000, 8080 );
// Declaring sync as a variable works best

// browserSync should only be used during development
module.exports = {
  entry : "./bundle.js",
  output: { path: outputPath, filename: "app.js" },
  plugins: [ sync ],
  // Put sync at the end as your browser should reload after done is built
};
```

The script has to run webpack in watch (-w) mode for browser-sync to be triggerd once webpack has rebuilt.

```
$ webpack -w
```

If this command does not work in your terminal, try installing the webpack cli using `npm install -g webpack` or run the command via a npm script (in your `package.json` under `scripts`), for example `"build": "webpack -w"` and `npm run build`.

### Generating more than one output file

Working example at [`examples/webpack/complete.js`](https://github.com/jneidel/setup-webpack/blob/master/examples/webpack/complete.js).

**app.bundle.js:**

```js
require( "./src/app.js" );
require( "./src/app.scss" );
```

**help.bundle.js:**

```js
require( "./src/help.js" );
require( "./src/help.scss" );
require( "./src/help.pug" );
```

**webpack.config.js:**

```js
const { genScss, babel, uglify, browserSync, polyfill } = require( "setup-webpack" );

require( "dotenv" ).config( { path: "vars.env" } );

const prod = process.env.NODE_ENV === "prod";

const sync = browserSync( 8000, 8080 );

const result = []; // Exported webpack config can be a obj or an array of objects

// Array of files to be build, e.g. different routes
[ "app", "help" ].forEach( ( name ) => {
  const scss = genScss( `${name}.css` );
  const pug = genPug( `${name}.html` );

  const entry = prod ? polyfill( `./${name}.bundle.js` ) : `./${name}.bundle.js`;
  result.push( {
    entry,
    output: { path: outputPath, filename: `${name}.js` },
    module: {
      loaders: prod ?
        [ babel, scss.loader, pug.loader ] :
        [ scss.loader, pug.loader ],
    },
    plugins: prod ?
      [ uglify, scss.plugin, pug.plugin ] :
      [ scss.plugin, pug.plugin, sync ],
  } );
} );

module.exports = result;
```

For each `require` in the entry file, the corresponding, transpiled output file will be generated.

Omission of `require`d files does not have any consequences, only the `*.bundle.js` file is necessary for the build to complete.

## API

Cherry-pick the parts that you need using object destructuring:

```js
const { genScss, babel, uglify } = require( "setup-webpack" );
```

- `babel`
- `uglify`
- `polyfill( path )`
- `genScss( path ) => { loader, plugin }`
- `genPug( path ) => { loader, plugin }`
- `browserSync( [proxy], [port] )`

### babel

Type: `object`

Unit: `loader`

Transpiling ES6+ javascript for older browsers ([more](https://babeljs.io/)) and minify contents (shrinks down files, removing whitespace, redundant characters, [more](https://babeljs.io/blog/2016/08/30/babili)).

Uses the [env](https://babeljs.io/docs/plugins/preset-env/) preset as well the [minifier](https://github.com/babel/minify) as options.

```js
const { babel } = require( "setup-webpack" );

module.exports = {
  module: {
    loaders: [ babel ]
  }
}
```

Using [babel-loader](https://www.npmjs.com/package/babel-loader), [babel-preset-env](https://www.npmjs.com/package/babel-preset-env), [babel-minify-webpack-plugin](https://www.npmjs.com/package/babel-minify-webpack-plugin), [babel-core](https://www.npmjs.com/package/babel-core) underneath.

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

### polyfill( path )

Type: `function`

Polyfills functions and methods not available in all browsers yet, [more](https://babeljs.io/docs/usage/polyfill/).

```js
const { polyfill } = require( "setup-webpack" );

module.exports = {
  entry: polyfill( "./bundle.js" )
}
```

#### path

Type: `string`

Path to entry point bundle, which requires the code to be build.

**bundle.js:**

```js
require( "./app.js" );
```

Using [babel-polyfill](https://www.npmjs.com/package/babel-polyfill) underneath.

### genScss( path ) => { loader, plugin }

Type: `function`, `generator`

Generates scss loader and plugin for the given output path.

#### path

Type: `string`

Output path for the transpiled css file. Path is relative to `output.path`.

#### => { loader, plugin }

Type: `object`

Extract scss from the javascript entry file and compiles it to css.

```js
const { genScss } = require( "setup-webpack" );

const scss = genScss( "app.css" ); // build/app.css

module.exports = {
  output: {
    path: path.resolve( __dirname, "build" ),
  },
  module: {
    loaders: [ scss.loader ]
  },
  plugins [ scss.plugin ]
}
```

Using [extract-text-webpack-plugin](https://www.npmjs.com/package/extract-text-webpack-plugin), [raw-loader](https://www.npmjs.com/package/raw-loader), [sass-loader](https://www.npmjs.com/package/sass-loader), [node-sass](https://www.npmjs.com/package/node-sass) underneath.

### genPug( path ) => { loader, plugin }

Type: `function`, `generator`

Generates pug loader and plugin for the given output path.

Functions exactly the same as `genScss`.

#### path

Type: `string`

Output path for the transpiled html file. Path is relative to `output.path`.

#### => { loader, plugin }

Type: `object`

Extract pug from the javascript entry file and compiles it to html.

```js
const { genPug } = require( "setup-webpack" );

const pug = genScss( "app.html" ); // build/app.html

module.exports = {
  output: {
    path: path.resolve( __dirname, "build" ),
  },
  module: {
    loaders: [ pug.loader ]
  },
  plugins [ pug.plugin ]
}
```

Using [extract-text-webpack-plugin](https://www.npmjs.com/package/extract-text-webpack-plugin), [pug](https://www.npmjs.com/package/pug), [pug-html-loader](https://www.npmjs.com/package/pug-html-loader) underneath.

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


```js
const { minify } = require( "setup-webpack" );

module.exports = {
  plugins: [ minify ]
}
```

Using [babel-minify-webpack-plugin](https://www.npmjs.com/package/babel-minify-webpack-plugin) underneath.


## License

MIT © [Jonathan Neidel](https://github.com/jneidel)
