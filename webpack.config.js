var config = require('./configuration');

var webpackDevtool = 'source-map';
var webpackWatch = false;
if (process.env.NODE_ENV === "development" ||
  process.env.NODE_ENV === 'testing') {
  // eval-source-map is the same thing as source-map,
  // except with caching. Don't use in production.
  webpackDevtool = 'eval-source-map';
  webpackWatch = true;
}

module.exports = {
  devtool: webpackDevtool,
  entry: ['babel-polyfill', config.files.srcJS],
  output: {filename: config.files.distJS},
  module: {
    loaders: [{
      exclude: /node_modules/,
      loader: 'babel',
      query: {
        cacheDirectory: true,
        plugins: ['transform-runtime'],
        presets: ['es2015', 'react']
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
    extensions: ['', '.js']
  },
  watch: webpackWatch
};
