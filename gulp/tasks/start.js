const gulp = require('gulp');
const runSequence = require('run-sequence');

gulp.task('start', (cb) => {
  return runSequence('styles', 'watch', cb);
});
