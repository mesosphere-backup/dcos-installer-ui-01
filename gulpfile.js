var autoprefixer = require('gulp-autoprefixer');
var browserSync = require('browser-sync');
var colorLighten = require('less-color-lighten');
var changed = require('gulp-changed');
var connect = require('gulp-connect');
var del = require('del');
var eslint = require('gulp-eslint');
var gulp = require('gulp');
var gulpif = require('gulp-if');
var gutil = require('gulp-util');
var less = require('gulp-less');
var mkdirp = require('mkdirp');
var cssNano = require('gulp-cssnano');
var path = require('path');
var replace = require('gulp-replace');
var runSequence = require('run-sequence');
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');
var webpack = require('webpack');

var config = require('./.build.config');
var packageInfo = require('./package');
var webpackConfig = require('./.webpack.config');

var development = process.env.NODE_ENV === 'development';
var appConfig = require('./src/js/config/Config');

var pluginsGlob = [
  appConfig.externalPluginsDirectory + '/**/*.*'
];

function browserSyncReload() {
  if (development) {
    browserSync.reload();
  }
}
// Watches for delete in external plugins directory and deletes counterpart in
// DCOS-UI directory
function deletePluginFile(event) {
  if (event.type === 'deleted') {
    var filePathFromPlugins = path.relative(
      path.resolve(appConfig.externalPluginsDirectory), event.path);

    var destFilePath = path.resolve(
      config.dirs.pluginsTmp, filePathFromPlugins);

    del.sync(destFilePath);
    webpackFn(browserSyncReload);
  }
}

// Make temp plugins directory if doesn't exist
mkdirp(config.dirs.pluginsTmp, function () {
  console.log('Created ' + config.dirs.pluginsTmp);
});

// Clean out plugins in destination folder
gulp.task('clean:external-plugins', function () {
  return del([config.dirs.pluginsTmp + '/**/*']);
});
// Copy over all
gulp.task('copy:external-plugins', ['clean:external-plugins'], function () {
  return gulp.src(pluginsGlob)
    .pipe(gulp.dest(config.dirs.pluginsTmp));
});

// Copy over changed files
gulp.task('copy:changed-external-plugins', function () {
  return gulp.src(pluginsGlob)
    .pipe(changed(config.dirs.pluginsTmp))
    .pipe(gulp.dest(config.dirs.pluginsTmp));
});

gulp.task('browsersync', function () {
  browserSync.init({
    open: false,
    port: 4200,
    server: {
      baseDir: config.dirs.distHTML
    },
    socket: {
      domain: 'localhost:4200'
    }
  });
});

// Create a function so we can use it inside of webpack's watch function.
function eslintFn() {
  return gulp.src([
    config.dirs.pluginsTmp + '/**/*.?(js|jsx)',
    config.dirs.srcJS + '/**/*.?(js|jsx)'
  ])
  .pipe(eslint())
  .pipe(eslint.formatEach('stylish', process.stderr));
};
gulp.task('eslint', eslintFn);

gulp.task('fonts', function () {
  return gulp.src([config.files.srcFonts])
    .pipe(gulp.dest(config.dirs.distFonts));
});

gulp.task('favicon', function () {
  return gulp.src([config.files.srcFavicon])
    .pipe(gulp.dest(config.dirs.distFavicon));
});

gulp.task('images', function () {
  return gulp.src([
    config.dirs.srcImg + '/**/*.*',
    '!' + config.dirs.srcImg + '/**/_exports/**/*.*'
  ])
  .pipe(gulp.dest(config.dirs.distImg));
});

gulp.task('html', function () {
  return gulp.src(config.files.srcHTML)
    .pipe(gulp.dest(config.dirs.distHTML))
    .on('end', browserSyncReload);
});

gulp.task('less', function () {
  return gulp.src(config.files.srcCSS)
    .pipe(gulpif(development, sourcemaps.init()))
    .pipe(less({
      paths: [config.dirs.cssSrc], // @import paths
      plugins: [colorLighten]
    }))
    .on('error', function (err) {
      gutil.log(err);
      this.emit('end');
    })
    .pipe(autoprefixer())
    .pipe(gulpif(development, sourcemaps.write()))
    .pipe(gulp.dest(config.dirs.distCSS))
    .pipe(gulpif(development, browserSync.stream()));
});

gulp.task('minify-css', ['less'], function () {
  return gulp.src(config.files.distCSS)
    .pipe(cssNano())
    .pipe(gulp.dest(config.dirs.distCSS));
});

gulp.task('minify-js', ['replace-js-strings'], function () {
  return gulp.src(config.files.distJS)
    .pipe(uglify({
      mangle: true,
      compress: true
    }))
    .pipe(gulp.dest(config.dirs.distJS));
});

function replaceJsStringsFn() {
  return gulp.src(config.files.distJS)
    .pipe(replace('@@VERSION', packageInfo.version))
    .pipe(replace('@@ENV', process.env.NODE_ENV))
    .pipe(gulp.dest(config.dirs.distJS))
    .on('end', browserSyncReload);
};
gulp.task('replace-js-strings', replaceJsStringsFn);

gulp.task('server', function () {
  connect.server({
    port: 4200,
    root: config.dirs.dist
  });
});

gulp.task('watch', function () {
  gulp.watch(config.files.srcHTML, ['html']);
  gulp.watch(config.dirs.srcCSS + '/**/*.less', ['less']);
  gulp.watch(config.dirs.srcImg + '/**/*.*', ['images']);
  var watcher = gulp.watch(pluginsGlob, ['copy:changed-external-plugins']);
  watcher.on('change', deletePluginFile);
  // Why aren't we watching any JS files? Because we use webpack's
  // internal watch, which is faster due to insane caching.
});

function webpackFn(callback) {
  var firstRun = true;

  webpack(webpackConfig, function (err, stats) {
    if (err) {
      throw new gutil.PluginError('webpack', err);
    }

    gutil.log('[webpack]', stats.toString({
      children: false,
      chunks: false,
      colors: true,
      modules: false,
      timing: true
    }));

    if (firstRun) {
      firstRun = false;
      if (callback) {
        callback();
      }
    } else {
      // This runs after webpack's internal watch rebuild.
      replaceJsStringsFn();
    }
    eslintFn();
  });
}
gulp.task('default', function (callback) {
  runSequence(
    'copy:external-plugins',
    ['replace-js-strings', 'less', 'images', 'fonts', 'favicon', 'html'],
    'webpack',
    'eslint',
    callback);
});

gulp.task('livereload', function (callback) {
  runSequence(
    'default',
    'browsersync',
    'watch',
    callback
  );
});

gulp.task('dist', function (callback) {
  runSequence(
    'default',
    'minify-css',
    'minify-js',
    callback
  );
});
// Use webpack to compile jsx into js.
gulp.task('webpack', webpackFn);
gulp.task('serve', ['server', 'default', 'watch']);
