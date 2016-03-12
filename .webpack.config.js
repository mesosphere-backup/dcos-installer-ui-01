var config = require('./.build.config');
var path = require('path');

var webpackDevtool = '#source-map';
var webpackWatch = false;
if (process.env.NODE_ENV === 'development' ||
  process.env.NODE_ENV === 'testing') {
  // eval-source-map is the same thing as source-map,
  // except with caching. Don't use in production.
  webpackDevtool = '#eval-source-map';
  webpackWatch = true;
}

module.exports = {
  devtool: webpackDevtool,
  entry: [config.files.srcJS],
  output: {filename: config.files.distJS},
  module: {
    loaders: [{
      exclude: /node_modules/,
      loader: 'babel-loader',
      query: {
        cacheDirectory: true
      },
      test: /\.js$/
    }],
    preLoaders: [{
      test: /\.js$/,
      loader: 'source-map-loader',
      exclude: /node_modules/
    }],
    postLoaders: [{
      loader: 'transform/cacheable?envify'
    }]
  },
  resolve: {
    root: path.resolve(__dirname),
    extensions: ['', '.js'],
    alias: {
      PluginSDK: 'src/js/plugin-bridge/PluginSDK',
      PluginTestUtils: 'src/js/plugin-bridge/PluginTestUtils'
    }
  },
  watch: webpackWatch
};
