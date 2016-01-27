var autoprefixer = require('gulp-autoprefixer');
var browserSync = require('browser-sync');
var colorLighten = require('less-color-lighten');
var connect = require('gulp-connect');
var eslint = require('gulp-eslint');
var gulp = require('gulp');
var gulpif = require('gulp-if');
var gutil = require('gulp-util');
var less = require('gulp-less');
var cssNano = require('gulp-cssnano');
var replace = require('gulp-replace');
var spawn = require('child_process').spawn;
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');
var webpack = require('webpack');

var config = require('./.build.config');
var packageInfo = require('./package');
var webpackConfig = require('./.webpack.config');

var development = process.env.NODE_ENV === 'development';

function browserSyncReload () {
  if (development) {
    browserSync.reload();
  }
}

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
function eslintFn () {
  return gulp.src([config.dirs.srcJS + '/**/*.?(js|jsx)'])
    .pipe(eslint())
    .pipe(eslint.formatEach('stylish', process.stderr));
};
gulp.task('eslint', eslintFn);

gulp.task('fonts', function () {
  return gulp.src([config.files.srcFonts])
    .pipe(gulp.dest(config.dirs.distFonts));
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

function replaceJsStringsFn () {
  return gulp.src(config.files.distJS)
    .pipe(replace('@@VERSION', packageInfo.version))
    .pipe(replace('@@ENV', process.env.NODE_ENV))
    .pipe(gulp.dest(config.dirs.distJS))
    .on('end', browserSyncReload);
};
gulp.task('replace-js-strings', ['webpack'], replaceJsStringsFn);

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
  // Why aren't we watching any JS files? Because we use webpack's
  // internal watch, which is faster due to insane caching.
});

// Use webpack to compile jsx into js.
gulp.task('webpack', ['eslint'], function () {
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

    eslintFn();
    replaceJsStringsFn();
  });
});

gulp.task('default', ['webpack', 'eslint', 'replace-js-strings', 'less', 'fonts', 'images', 'html']);

gulp.task('dist', ['default', 'minify-css', 'minify-js']);

gulp.task('serve', ['server', 'default', 'watch']);

gulp.task('livereload', ['default', 'browsersync', 'watch']);
