module.exports = {
  root: {
    src: './src'
  },
  tasks: {
    styles: {
      // Relative to root.src
      src: '/_styles',
      dest: '/styles',
      files: ['theme.scss', 'checkout.scss'],
      watchTask: 'styles',
      extensions: ['scss', 'css']
    },
    scripts: {
      src: '/_scripts',
      dest: '/scripts',
      extensions: ['js'],
      bundles: [{
        entries: 'theme.js',
        outputName: 'theme.js'
      },
      {
        entries: 'checkout.js',
        outputName: 'checkout.js'
      }]
    },
    eslint: {
      filePattern: ['gulpfile.js/**/*.js', 'src/_scripts/**/*.js'],
      extensions: ['js']
    },
  }
};
