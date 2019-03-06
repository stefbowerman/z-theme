const notify = require('gulp-notify');

module.exports = (errorObject) => {
  const errSting = errorObject.toString().split(': ').join(':\n');

  // Send error to notification center with gulp-notify
  notify.onError({
    title: 'Compile Error',
    message: errSting
  });

  // Keep gulp from hanging on this task
  if (typeof this.emit === 'function') this.emit('end');
};
