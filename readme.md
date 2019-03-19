# setup-webpack

> Opinionated module of webpack loaders/plugins for simplified usage with examples for common use cases

[![](https://img.shields.io/npm/dw/setup-webpack.svg?style=flat-square)](https://www.npmjs.com/package/setup-webpack)
[![](https://img.shields.io/badge/license-MIT-green.svg?style=flat-square)](https://github.com/jneidel/setup-webpack/blob/master/licence)

Reduce boilerplate when creating your webpack config and keep your package.json slim.

Includes abstractions for transforming scss and pug, transpiling and polyfilling your javascript, minfication and reloading the browser on changes. All usage patterns are described with clear examples.

<details>
<summary><strong>Table of Contents</strong></summary>

<!-- toc -->

- [Install](#install)
- [Usage](#usage)
- [Examples](#examples)
  * [Get up to speed with webpack](#get-up-to-speed-with-webpack)
  * [Transform scss into css](#transform-scss-into-css)
  * [Transform pug into html](#transform-pug-into-html)
  * [Transform markdown into html](#transform-markdown-into-html)
  * [Minify and transpile ES6 JavaScript](#minify-and-transpile-es6-javascript)
  * [Reload browser on file changes](#reload-browser-on-file-changes)
  * [Differentiate between development and production env](#differentiate-between-development-and-production-env)
  * [Generating more than one output file](#generating-more-than-one-output-file)
- [API](#api)
  * [babel](#babel)
  * [polyfill( path )](#polyfill-path-)
  * [genScss( path )](#genscss-path-)
  * [pug( path )](#pug-path-)
  * [img( directory )](#img-directory-)
  * [md( path, [gfm, style, border] )](#md-path-gfm-style-border-)
  * [browserSync( [proxy], [port] )](#browsersync-proxy-port-)
- [Changelog](#changelog)
- [License](#license)

<!-- tocstop -->

</details>

## Install

[![](https://img.shields.io/npm/v/setup-webpack.svg?style=flat-square)](https://www.npmjs.com/package/setup-webpack)
![](https://img.shields.io/badge/webpack-v4-blue.svg?style=flat-square)

```
$ npm install setup-webpack
```

<details>
<summary><strong>Install version <code>v1</code></strong></summary>
<br>

[![](https://img.shields.io/badge/npm-1.2.1-blue.svg?style=flat-square)](https://www.npmjs.com/package/setup-webpack/v/1.2.1)
![](https://img.shields.io/badge/webpack-v3-blue.svg?style=flat-square)

```
$ npm install setup-webpack@1
```

The documentation for `v1` can be found [here](https://github.com/jneidel/setup-webpack/tree/822e8d2c383121814f9c5b24634a05a41941596f).

</details>

<details>
<summary><strong>Upgrade to version <code>v2</code></strong></summary>
<br>

Version `v2` upgrades webpack to `v4`, introducing a few breaking changes:

**Require `mode`:**

Either `development` or `production`.

```js
{
  mode: "production",
}
```

**Rename `loaders` field to `rules`:**

`v1`:

```js
{
  module: {
    loaders: [ babel, ... ]
  }
}
```

`v2`:

```js
{
  module: {
    rules: [ babel, ... ]
  }
}
```

**Deprecate `uglify`:**

This deprecates the `uglify` plugin, as it is included in using `optimization.minimize = true`.

`v1`:

```js
{
  plugins: [ uglify ]
}
```

`v2`:

```js
{
  optimization: {
    minimize : true
  }
}
```

**Change `genPug` to `pug`:**

`v1`:

```js
const pug = genPug( "index.html" );

{
  module: {
    loaders: [ pug.loader ]
  },
  plugins: [ pug.plugin ]
}
```

`v2`:

```js
{
  module: {
    rules: [ pug( "index.html" ) ]
  }
}
```

**Change `genScss` syntax:**

`v1`:

```js
const scss = genPug( "styles.css" );

{
  module: {
    loaders: [ scss.loader ]
  },
  plugins: [ scss.plugin ]
}
```

`v2`:

```js
{
  module: {
    rules: [ scss.rule ]
  },
  plugins: [ scss.plugin ]
  optimization: {
    minimizer: [ scss.minimizer ],
  }
}
```

</details>

## Usage

**webpack.config.js:**

```js
const { babel, polyfill, browserSync, pug, genScss, img } = require( "setup-webpack" );

const sync = browserSync( 8000, 8080 );

const scss = genScss( "app.css" );

module.exports = {
  mode  : "production",
  entry : polyfill( "./app.bundle.js" ),
  output: {
    path    : path.resolve( __dirname, "build" ),
    filename: "app.js",
  },
  module: {
    rules: [ babel, pug( "app.html" ), scss.rule, scss.font, img( "img/" ) ],
  },
  plugins: [ scss.plugin, sync ],
  optimization: {
    minimize: true,
    minimizer: [ scss.minimizer ],
  },
};
```

## Examples

All examples can be found in the [`examples/webpack`](examples/webpack) folder.

Clone the repo to run the examples:

```
$ git clone https://github.com/jneidel/setup-webpack.git
```

<details>
<summary><strong>Get up to speed with webpack</strong></summary>
<br>

The default config location is in the root of the project, in a file named `webpack.config.js`.

The files to transpile are `require`d or `importe`d into a single bundle file:

**app.bundle.js:**

```js
require( "./js/app" );
require( "./js/global-variables" );
require( "axios" );

require( "./scss/base-styles.scss" );
require( "./scss/app.scss" );

require( "./pug/app.pug" );
```

The bundle file will serve as an entry point for webpack, which will then split up the different file types again. Files of the same type (eg: `.js`) will be bundled into a single output file.

**webpack.config.js:**

```js
const path = require( "path" );
const { pug, genScss } = require( "setup-webpack" );

const scss = genScss( "styles.css" ); // Set output path for css file

module.exports = {
  mode : "development", // Run webpack either on 'development' or 'production' mode
  entry: "./app.bundle.js", // Entry file that will be loaded into webpack,
  output: {                 // will be a bundle in our case
    path: path.resolve( __dirname, "build" ) // Specifies the output path for all files
    filename: "scripts.js", // Name of the main file to be exported, which
  },                        // will even be exported if no js files are being imported
  module: {
    rules: [
      scss.rule, // Extract scss and turn it into css
      pug( "index.html" ) // Extract pug, turn into html and save to path
    ]
  },
  plugins: [ scss.plugin ] // Save css to above specified path
  optimization: { // Production optimizations
    minimize: true, // Minimize js
    minimizer: [ scss.minimizer ], // Minimize css
  },
};
```

**Required in every config:**

- `mode`
- `entry`
- `output`
    - `output.path`
    - `output.filename`

For a more in-depth intro, check out the [webpack docs](https://webpack.js.org/guides/getting-started/).

</details>

### Transform scss into css

Transform [scss](https://sass-lang.com/) or (sass) files to css.

View commented example at [`examples/webpack/scss.js`](examples/webpack/scss.js).

To import [local fonts](#genscss-path-) and [local images](#img-directory-) check out the corresponding API docs.

### Transform pug into html

Transform [pug](https://github.com/pugjs/pug) to html.

View example at [`examples/webpack/pug.js`](examples/webpack/pug.js).

To import [local images](#img-directory-) check out the corresponding API docs.

### Transform markdown into html

Transform markdown to html, applying GFM styles.

View example at [`examples/webpack/md.js`](examples/webpack/md.js).

### Minify and transpile ES6 JavaScript

Reduce file size minify your code and, for compatibility with older browsers, polyfill and transpile ES6+ using babel.

View working commented example at [`examples/webpack/prod.js`](examples/webpack/prod.js).

Because this process takes some time, you only want to run this in a production environment and not during development.

### Reload browser on file changes

Any changes to the files included in the bundle will cause the project to be rebuild and the browser to reload.

View example at [`examples/webpack/sync.js`](examples/webpack/sync.js).

The script has to run webpack in watch (-w) mode in order for browser-sync to be triggered once the project has been rebuilt.

```zsh
$ webpack -w
```

Running this command in your terminal will require you to install the webpack-cli, to make use of the local installation use the command in a npm script.

```
"scripts": {
  "watch": "webpack -w"
}
```

### Differentiate between development and production env

Minification and transpiling will only be triggered by environment variables that indicate a production environment.

View working example at [`examples/webpack/env.js`](examples/webpack/env.js).

### Generating more than one output file

View example at [`examples/webpack/complete.js`](examples/webpack/complete.js).

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
  <td>Examples: <a href="examples/webpack/prod.js"><code>prod</code></a>, <a href="examples/webpack/env.js"><code>env</code></a>, <a href="examples/webpack/complete.js"><code>complete</code></a></td>
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
  <td>Examples: <a href="examples/webpack/prod.js"><code>prod</code></a>, <a href="examples/webpack/complete.js"><code>complete</code></a></td>
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
  <td>Type: <br><code>function</code>, <code>generator</code></td>
  <td>Param: <br><code>path</code></td>
  <td>Return: <br><code>{ rule, plugin, minimizer, font }</code></td>
  <td>Examples: <br><a href="examples/webpack/scss.js"><code>scss</code></a>, <a href="examples/webpack/env.js"><code>env</code></a>, <a href="examples/webpack/complete.js"><code>complete</code></a>, <a href="examples/webpack/font.js"><code>font</code></a></td>
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

**font:**

`genScss` also generates includes `scss.font`, which is a rule that should be included if you're importing local font files within your sass.

```js
{
  module: {
    rules: [ scss.rule, scss.font ]
  }
}
```

Uses [node-sass](https://www.npmjs.com/package/node-sass), [mini-css-extract-plugin](https://www.npmjs.com/package/mini-css-extract-plugin), [sass-loader](https://www.npmjs.com/package/sass-loader), [css-loader](https://www.npmjs.com/package/), [optimize-css-assets-webpack-plugin](https://www.npmjs.com/package/), [file-loader](https://www.npmjs.com/package/file-loader) under the hood.

### pug( path, [data] )

<table><tr>
  <td>Type: <code>function</code></td>
  <td>Param: <code>path</code>, <code>data</code></td>
  <td>Return: <code>rule</code></td>
  <td>Examples: <a href="examples/webpack/pug.js"><code>pug</code></a>, <a href="examples/webpack/pug-data.js"><code>pug-data</code></a>, <a href="examples/webpack/complete.js"><code>complete</code></a></td>
</tr></table>

Transpiles pug code in the entry file into html and writes the file to the given path.

```js
module.exports = {
  output: {
    path: path.resolve( __dirname, "build" ),
  },
  module: {
    rules: [ pug( "./index.html" ), { headline: "Headline Content" } ],
  },
}

//=> Saved as build/index.html
```

**path**

Output path of the html file.

```
pug( "./index.html" )
```

**[data]**

Data to be passed to pug. In pug available as javascript variables.

```
pug( "./index.html", { place: "Berlin", time: Data.now() } )
```

Uses [pug-html-loader](https://www.npmjs.com/package/pug-html-loader), [html-loader](https://www.npmjs.com/package/html-loader), [extract-loader](https://www.npmjs.com/package/extract-loader), [file-loader](https://www.npmjs.com/package/) under the hood.

### img( directory )

<table><tr>
  <td>Type: <code>function</code></td>
  <td>Param: <code>directory</code></td>
  <td>Return: <code>rule</code></td>
  <td>Examples: <a href="examples/webpack/img.js"><code>img</code></a></td>
</tr></table>

This loader should only be used if you import local images in your pug or scss code.

Unlike the other loaders, this one only takes a directory, not a full path. The filename/extension will be copied over from the original, to not mix up different images.

```js
module.exports = {
  output: {
    path: path.resolve( __dirname, "build" ),
  },
  module: {
    rules: [ img( "./img" ) ],
  },
}

//=> Saved as build/img/[name].[ext]
```

Uses [file-loader](https://www.npmjs.com/package/) under the hood.

### md( path, [gfm, style, border] )

<table><tr>
  <td>Type: <code>function</code></td>
  <td>Param: <code>path</code>, <code>gfm</code>, <code>style</code>, <code>border</code></td>
  <td>Return: <code>rule</code></td>
  <td>Examples: <a href="examples/webpack/md.js"><code>md</code></a></td>
</tr></table>

Transpile `require`d markdown files into html. GFM (github flavored markdown) styles are applied.

```js
module.exports = {
  output: {
    path: path.resolve( __dirname, "build" ),
  },
  module: {
    rules: [ md( "./docs.html" ) ],
  },
}

//=> Saved as build/docs.html
```

**path:**

Output path for the html file.

```js
md( "docs.html" )
```

**gfm:**

Default: [sindresorhus/github-markdown-css](https://cdnjs.cloudflare.com/ajax/libs/github-markdown-css/2.10.0/github-markdown.min.css)

`href` that will be set as stylesheet source for applying the gfm styles.

```js
md( "docs.html", "gfm.css" )
```

**style:**

`href` for an additional stylesheet.
To customize the gfm styles.

```js
md( "docs.html", "gfm.css", "custom.css" )
```

**border:**

Pass `true` to add a Github styled border around the `<body>`. See source module for rendered example: [jneidel/gfm-loader](https://github.com/jneidel/gfm-loader#example).

```js
md( "docs.html", "gfm.css", "custom.css", true )
```

Uses [markdown-loader](https://www.npmjs.com/package/markdown-loader), [html-loader](https://www.npmjs.com/package/html-loader), [extract-loader](https://www.npmjs.com/package/extract-loader), [gfm-loader](https://www.npmjs.com/package/gfm-loader), [file-loader](https://www.npmjs.com/package/) under the hood.

### browserSync( [proxy, port] )

<table><tr>
  <td>Type: <code>function</code></td>
  <td>Param: <code>proxy</code>, <code>port</code></td>
  <td>Return: <code>plugin</code></td>
  <td>Examples: <a href="examples/webpack/sync.js"><code>sync</code></a>, <a href="examples/webpack/env.js"><code>env</code></a>, <a href="examples/webpack/complete.js"><code>complete</code></a></td>
</tr></table>

Reloads brower windows connected on a given port, after webpack has rebuilt.

The proxy as well as the port are using localhost.

**proxy:**

Optional

Type: `number`

Default: `8000`

Describes the port your server/app is running on.

**port:**

Optional

Type: `number`

Default: `8080`

Describes the port which browser-sync will be running on. Only browser windows connected to this port will be reloaded.

**Without a server:**

Currently not supported in this module, but can be easily done using the browser-sync-cli:

In your npm package.json:

```json
"scripts": {
  "build": "webpack -w",
  "sync": "browser-sync --server --files [ 'dist' ]", // Files/dirs to watch for changes
  "watch": "concurrently 'npm run build' 'npm run sync' --names '📦,🔄' --prefix name",
}
```

This script requires the global installation of [`concurrently`](https://www.npmjs.com/package/concurrently).

Uses [browser-sync](https://www.npmjs.com/package/browser-sync), [browser-sync-webpack-plugin](https://www.npmjs.com/package/browser-sync-webpack-plugin) under the hood.

## Changelog

**2.3.0:**

- Add `md` parameters (`style`, `border`)

**Previous:**

For upgrading to `2.x` see [install](#install).

## License

MIT © [Jonathan Neidel](https://github.com/jneidel)
