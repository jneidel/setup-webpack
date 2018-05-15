# setup-webpack

> Opinionated module of webpack plugins and rules for simple setup with explanations of common use cases

[![](https://img.shields.io/npm/dw/setup-webpack.svg?style=flat-square)](https://www.npmjs.com/package/setup-webpack)
[![](https://img.shields.io/badge/license-MIT-green.svg?style=flat-square)](https://github.com/jneidel/setup-webpack/blob/master/licence)

Reduce boilerplate when creating your webpack config and keep your package.json slim.

Includes abstractions for transforming scss and pug, transpiling and polyfilling your javascript, minfication and reloading the browser on changes. All usage patterns are described with clear examples.

<details>
<summary><strong>Table of Contents</strong></summary>

<!-- toc -->

- [Install](#install)
  * [Webpack 3](#webpack-3)
- [Usage](#usage)
- [Usage Patterns](#usage-patterns)
  * [Get up to speed with webpack](#get-up-to-speed-with-webpack)
  * [Transform scss into css](#transform-scss-into-css)
  * [Transform pug into html](#transform-pug-into-html)
  * [Minify and transpile ES6+](#minify-and-transpile-es6)
  * [Differentiate between development and production env](#differentiate-between-development-and-production-env)
  * [Reload browser on changes](#reload-browser-on-changes)
  * [Generating more than one output file](#generating-more-than-one-output-file)
- [API](#api)
  * [babel](#babel)
  * [polyfill( path )](#polyfill-path-)
  * [genScss( path )](#genscss-path-)
  * [pug( path )](#pug-path-)
  * [browserSync( [proxy], [port] )](#browsersync-proxy-port-)
- [License](#license)

<!-- tocstop -->

</details>

## Install

**Webpack 4:**


[![](https://img.shields.io/npm/v/setup-webpack.svg?style=flat-square)](https://www.npmjs.com/package/setup-webpack)

```
$ npm install setup-webpack
```

**Webpack 3:**


[![](https://img.shields.io/badge/npm-1.2.1-blue.svg?style=flat-square)](https://www.npmjs.com/package/setup-webpack/v/1.2.1)

```
$ npm install setup-webpack@1
```

The documentation for `v1.2.1` can be found [here](https://github.com/jneidel/setup-webpack/tree/822e8d2c383121814f9c5b24634a05a41941596f).

## Usage

**webpack.config.js:**

```js
const { babel, polyfill, browserSync, pug, genScss } = require( "setup-webpack" );

const sync = browserSync( 8000, 8080 );

const scss = genScss( "app.css" );

module.exports = {
  mode  : "development",
  entry : polyfill( "./app.bundle.js" ),
  output: {
    path    : path.resolve( __dirname, "build" ),
    filename: "app.js",
  },
  module: {
    rules: [ babel, pug( "app.html" ), scss.rule ],
  },
  plugins: [ uglify, scss.plugin, sync ],
  optimization: {
    minimize: true,
    minimizer: [ scss.minimizer ],
  },
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

To avoid duplication, the output path we define here will be used throughout all examples.

```js
const path = require( "path" );

const outputPath = path.resolve( __dirname, "build" );
```

### Get up to speed with webpack

Before starting, let's make sure we know what a basic webpack config looks like:

(For webpack to find your config, give the file the conventional name `webpack.config.js` and save it in the project root.)

**webpack.config.js:**

```js
module.exports = {
  mode : "development",
  entry: "./src/index.js", // Entry file that will be loaded into webpack,
  output: {                // will be a bundle in our case
    path: path.resolve( __dirname, "build" ) // Specifies the output path for all files
    filename: "app.js", // Name of the main file to be exported
  },
  optimization: { // Production optimizations
    minimize: true,
  },
};
```

`entry` and `output` (`output.path` & `output.filename`) are required in every config.

For a more in-depth intro, check out the [webpack docs](https://webpack.js.org/guides/getting-started/).

### Transform scss into css

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
  entry : "./bundle.js",
  output: { path: outputPath, filename: "app.js", },
  // Will create an empty 'build/app.js' file, as no javascript is required in 'bundle.js'
  module: { // Transpiling happens here
    rules: [ scss.rule ],
  },
  plugins: [
    scss.plugin,
  ],
  optimization: { // If mode set to 'production' use scss minimizer
    minimizer: [ scss.minimizer ],
  },
}
```

### Transform pug into html

Transform [pug](https://github.com/pugjs/pug) to html.

Working example at [`examples/webpack/pug.js`](https://github.com/jneidel/setup-webpack/blob/master/examples/webpack/pug.js).

**bundle.js:**

```js
require( "./src/app.pug" );
```

**webpack.config.js:**

```js
const { pug } = require( "setup-webpack" );

module.exports = {
  entry : "./bundle.js",
  output: { path: outputPath, filename: "app.js" },
  module: {
    rules: [ pug( "../html/index.html" ) ],
  },
};
```

### Minify and transpile ES6+

Reduce file size using uglify/minify and, for compatability with older browsers, polyfill and transpile ES6+ using babel.

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
  // Wrap bundle in a polyfill function to polyfill the given bundle
  output: { path: outputPath, filename: "app.js" },
  module: { // Transpiling happens here
    loaders: [ babel ],
  }, // And compression and minfiying here
  plugins: [ uglify ],
};
```

Because this process takes some time, you only want to run this in a production environment and not during development.

### Differentiate between development and production env

Compression and transpiling will only be triggerd by enviroment variables that indicate a production evironment.

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

Any changes to the files included in the `bundle.js` will cause the project to be rebuild and the browser to reload.

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
  // Put sync at the end so that your browser reloads after the build has completed
};
```

The script has to run webpack in watch (-w) mode in order for browser-sync to be triggerd once the project has been rebuilt.

```
$ webpack -w
```

If this command does not work in your terminal, try installing the webpack-cli using `npm install -g webpack` or run the command via a npm script (in your `package.json` under `scripts`), for example `"build": "webpack -w"` and `npm run build`.

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

const result = []; // Exported webpack config can be an obj or an array of objects

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

For each `require` in the entry file, this webpack config will output a transpiled file. If multiple files of the same type are `require`d they will be bundled together in a single output file, making it easier for you to import them into your html document and edit their contents.

If no files of a specific type `js|scss|pug` are `require`d in, webpack will simply not generate an output file of that type. Only the `*.bundle.js` file is necessary for the build to complete.

## API

Cherry-pick the parts that you need using object destructuring:

```js
const { babel, pug, genScss } = require( "setup-webpack" );
```

### babel

<table><tr>
  <td>Type: <code>object</code></td>
  <td>Param: <code>path</code></td>
  <td>Return: <code>rule</code></td>
</tr></table>

This loader transpiles ES6+ javascript for older browsers ([more on babel](https://babeljs.io/)) and minifies contents (shrinks down files, removing whitespace, redundant characters, [more on minify](https://babeljs.io/blog/2016/08/30/babili)).

Uses the [env](https://babeljs.io/docs/plugins/preset-env/) preset as well the [minifier](https://github.com/babel/minify) as options.

```js
module.exports = {
  module: {
    rules: [ babel ]
  }
}
```

Uses [babel-loader](https://www.npmjs.com/package/babel-loader), [babel-preset-env](https://www.npmjs.com/package/babel-preset-env), [babel-minify-webpack-plugin](https://www.npmjs.com/package/babel-minify-webpack-plugin), [babel-core](https://www.npmjs.com/package/babel-core) under the hood.

### polyfill( path )

<table><tr>
  <td>Type: <code>function</code></td>
  <td>Param: <code>path</code></td>
  <td>Return: <code>entry</code></td>
</tr></table>

Polyfills functions and methods not yet available in all browsers. For more information see [polyfill](https://babeljs.io/docs/usage/polyfill/).

```js
module.exports = {
  entry: polyfill( "./bundle.js" )
}
```

**path:**

Path to entry point bundle, which requires the code to be build.

Uses [babel-polyfill](https://www.npmjs.com/package/babel-polyfill) under the hood.

### genScss( path )

<table><tr>
  <td>Type: <code>function</code>, <code>generator</code></td>
  <td>Param: <code>path</code></td>
  <td>Return: <code>{ rule, plugin, minimizer }</code></td>
</tr></table>

Transpiles scss code in the entry file into css and writes the file to the given path.

Function generates a webpack rule, plugin and minimizer:

```js
const scss = genScss( "app.css" ); 

module.exports = {
  output: {
    path: path.resolve( __dirname, "build" ),
  },
  module: {
    rules: [ scss.rule ],
  },
  plugins: [ scss.plugin ],
  optimization: {
    minimizer: [ scss.minimizer ],
  },
}

//=> Saved as build/app.css
```

Uses [node-sass](https://www.npmjs.com/package/node-sass), [mini-css-extract-plugin](https://www.npmjs.com/package/mini-css-extract-plugin), [sass-loader](https://www.npmjs.com/package/sass-loader), [css-loader](https://www.npmjs.com/package/), [optimize-css-assets-webpack-plugin](https://www.npmjs.com/package/) under the hood.

### pug( path )

<table><tr>
  <td>Type: <code>function</code></td>
  <td>Param: <code>path</code></td>
  <td>Return: <code>rule</code></td>
</tr></table>

Transpiles pug code in the entry file into html and writes the file to the given path.

```js
module.exports = {
  output: {
    path: path.resolve( __dirname, "build" ),
  },
  module: {
    rules: [ pug( "./index.html" ) ],
  },
}

//=> Saved as build/index.html
```

Uses [pug-html-loader](https://www.npmjs.com/package/pug-html-loader), [html-loader](https://www.npmjs.com/package/html-loader), [extract-loader](https://www.npmjs.com/package/extract-loader), [file-loader](https://www.npmjs.com/package/) under the hood.

### browserSync( [proxy], [port] )

<table><tr>
  <td>Type: <code>function</code></td>
  <td>Param: <code>[proxy], [port]</code></td>
  <td>Return: <code>plugin</code></td>
</tr></table>

Reloads brower windows connected on a given port, after webpack has rebuilt.

The proxy as well as the port are using localhost.

**proxy:**

Optional

Type: `number`

Default: `8000`

Describes the port your app is running on.

**port:**

Optional

Type: `number`

Default: `8080`

Describes the port which browser-sync will be running on. Only browser windows connected to this port will be reloaded.

Uses [browser-sync](https://www.npmjs.com/package/browser-sync), [browser-sync-webpack-plugin](https://www.npmjs.com/package/browser-sync-webpack-plugin) under the hood.

## License

MIT © [Jonathan Neidel](https://github.com/jneidel)
