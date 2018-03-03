const range = require( "py-range" );

const [ a, b, c, d ] = range( 2, 10, 2 );

const add = ( ...args ) => args.reduce( ( acc, cur ) => acc + cur );

document.getElementById( "result" ).innerHTML += `The result is: ${add( a, b, c, d )}`;
