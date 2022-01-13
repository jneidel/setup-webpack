const connect = require( "connect" );
const serveStatic = require( "serve-static" );
const path = require( "path" );

connect().use( serveStatic( path.resolve( __dirname, "../build" ) ) ).listen( 8000, () => {
  console.log( "Server running on http://localhost:8000" );
} );
