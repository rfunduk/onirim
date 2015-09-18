var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var config = require('./webpack.config');

var server = new WebpackDevServer( webpack( config ), {
  hot: true,
  historyApiFallback: true,
  stats: {
    assets: false,
    colors: true,
    version: false,
    hash: false,
    timings: true,
    chunks: true,
    chunkModules: false
  }
} );

server.listen( 5300, 'localhost', function( err, result ) {
  if( err ) { console.log(err); }
  console.log('Webpack Dev Server ready on port 5300...');
} );
