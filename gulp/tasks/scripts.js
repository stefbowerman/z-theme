const config = require('../config');
const browserify = require('browserify');
const buffer = require('vinyl-buffer');
const babelify = require('babelify');
const gulp = require('gulp');
const es2015ie = require('babel-preset-es2015-ie');
const mergeStream = require('merge-stream');
const path = require('path');
const size = require('gulp-size');
const source = require('vinyl-source-stream');
const uglify = require('gulp-uglify');
const uglifyify = require('uglifyify');
const watchify = require('watchify');
const bundleLogger = require('../lib/bundleLogger');
const colors = require('ansi-colors');
const log = require('fancy-log');

const browserifyThis = (bundleConfig) => {
  const paths = {
    src: path.join(config.root.src, config.tasks.scripts.src, bundleConfig.entries),
    dest: path.join(config.root.src, config.tasks.scripts.dest)
  };

  // config our bundle setup.
  Object.assign(bundleConfig, watchify.args, { debug: false, entries: paths.src });

  let b = browserify(bundleConfig)
    .transform(babelify, {presets: [es2015ie], extensions: ['.js', '.ts']});

  b.transform(uglifyify);

  const bundle = () => {
    bundleLogger.start(paths.src);

    return b.bundle()
      .on('error', function(error) {
        bundleLogger.error(error);
      })
      .pipe(source(bundleConfig.outputName))
      .pipe(buffer()) // optional, remove if no need to buffer file contents
      .pipe(uglify())
      .pipe(gulp.dest(paths.dest))
      .pipe(size({showFiles: true, title: 'JS: size of'}))
      .on('finish', function() {
        bundleLogger.end(paths.src);
      });
  };

  b = watchify(b);

  // Rebundle on update
  b.on('update', bundle);
  bundleLogger.watch(paths.src);

  return bundle();
};

// Start bundling with Browserify for each bundleConfig specified
gulp.task('scripts', () => mergeStream.apply(gulp, config.tasks.scripts.bundles.map(browserifyThis)));
