const config = require('../config');
const gulp = require('gulp');
const handleErrors = require('../lib/handleErrors');
const path = require('path');
const sass = require('gulp-sass');
const size = require('gulp-size');
const postcss = require('gulp-postcss');
const debug = require('gulp-debug');
const insert = require('gulp-insert');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const styleWarning = require('../lib/stylesWarning');
const merge = require('merge-stream');

const sassOptions = {
  outputStyle: 'nested', // libsass doesn't support expanded yet
  precision: 10,
  errLogToConsole: true // else watch breaks
};

const postcssPlugins = [
  autoprefixer(), // Browsers pulled from .browserslistrc
  cssnano({
    discardUnused: true, // don't discard unused  at-rules (@keyframes for example that aren't used)
    zindex: false, // don't optimize z-index stacking... very dangerous
    autoprefixer: false // don't remove unnecessary prefixes. we're setting this above
  })
];

const stylePipeline = (src) => {
 return gulp.src(src)
    .pipe(sass(sassOptions).on('error', sass.logError))
    .on('error', handleErrors)
    .pipe(postcss(postcssPlugins))
    .pipe(insert.prepend(styleWarning()))
    .pipe(gulp.dest(path.join(config.root.src, config.tasks.styles.dest)))
    .pipe(debug())
    .pipe(size({showFiles: true, title: 'CSS: size of'}));
}

gulp.task('styles', () => {

  const mergeInstance = merge();

  config.tasks.styles.files.forEach((filename) => {
    mergeInstance.add( stylePipeline(path.join(config.root.src, config.tasks.styles.src, filename)) );
  });

  return mergeInstance;
});
