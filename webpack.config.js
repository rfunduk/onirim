var path = require('path')
var webpack = require('webpack')

var ETPlugin = require('extract-text-webpack-plugin')
var CompressionPlugin = require('compression-webpack-plugin')
var HtmlWebpackPlugin = require('html-webpack-plugin')

var outputDir = path.join( __dirname, './build' )
var PRODUCTION = process.env.NODE_ENV == 'production'

var plugins = [
  new webpack.EnvironmentPlugin('NODE_ENV'),
  new webpack.optimize.DedupePlugin(),
  new webpack.PrefetchPlugin('react'),
  new webpack.DefinePlugin( { '__DEV__': !PRODUCTION } )
]

var aliases = {
  // prevent duplicate reacts from being required
  // by dependencies in node_modules
  'react': 'react',
  'react-dom': 'react-dom'
}

var entry = [
  './app/index.jsx',
  './app/index.less'
]

if( PRODUCTION ) {
  // in production load minified react
  // aliases.react = 'react/dist/react.min'
  // aliases['react-dom'] = 'react/../../lib/ReactDOMClient'

  plugins.push( new HtmlWebpackPlugin( {
    title: 'ONIRIM',
    template: 'app/template.index.html'
  } ) )
  plugins.push( new ETPlugin( 'app.[hash].css' ) )
  plugins.push( new webpack.optimize.OccurenceOrderPlugin() )
  plugins.push( new webpack.optimize.UglifyJsPlugin( {
    sourceMap: false,
    compress: {
      dead_code: true,
      unused: false,
      warnings: false,
      unsafe: true,
      comparisons: true,
      booleans: true,
      loops: true,
      drop_console: true
    },
    screw_ie8: true,
    comments: false,
    exclude: new RegExp(/min\.js$/),
  } ) )
  // plugins.push( new CompressionPlugin( {
  //   asset: '{file}.gz',
  //   algorithm: 'gzip',
  //   regExp: /\.js$|\.css$/,
  //   threshold: 10240,
  //   minRatio: 0.8,
  // } ) )
}
else {
  // hot module replacement in dev only
  entry.unshift(
    'webpack-dev-server/client?http://localhost:5300',
    'webpack/hot/only-dev-server'
  )
  plugins.unshift( new webpack.HotModuleReplacementPlugin() )
  plugins.unshift( new webpack.NoErrorsPlugin() )
}

module.exports = {
  plugins: plugins,
  stats: {
    chunks: false,
    assets: false,
    chunkModules: false,
    chunkOrigins: false,
    modules: false,
    cached: false,
    cachedAssets: false,
    children: false,
    source: false
  },
  devtool: PRODUCTION ? null : 'cheap-module-eval-source-map',
  entry: entry,
  output: {
    path: outputDir,
    publicPath: PRODUCTION ? '' : 'http://localhost:5300/',
    filename: PRODUCTION ? 'app.[hash].js' : 'app.js'
  },
  resolve: {
    unsafeCache: true,
    alias: aliases,
    modulesDirectories: [ 'node_modules' ],
    extensions: [
      '',
      '.js', '.jsx',
      '.css', '.less',
    ]
  },
  options: {
    // overrides for .babelrc in production
    babel: {
      optional: PRODUCTION ?
        [ 'optimisation.react.inlineElements' ] :
        []
    }
  },
  module: {
    noParse: [],
    loaders: [
      // scripts
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        include: __dirname,
        loaders: PRODUCTION ?
          ['babel'] :
          ['react-hot', 'babel']
      },

      // styles
      {
        test: /\.css$/,
        loader: PRODUCTION ?
          ETPlugin.extract('style', 'css') :
          'style!css'
      },
      {
        test: /\.less$/,
        loader: PRODUCTION ?
          ETPlugin.extract('style', 'css!less') :
          'style!css!less'
      },

      // images
      {
        test: /\.(jpe?g|png|svg).*$/,
        loader: 'url?limit=250000'
      }
    ]
  }
}
