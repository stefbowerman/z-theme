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
    }
  }
};
