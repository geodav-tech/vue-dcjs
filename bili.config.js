module.exports = {
  banner: true,
  output: {
    extractCSS: false,
    dir: 'bundle',
    minify: true
  },
  plugins: {
    vue: {
      css: true
    }
  }
};