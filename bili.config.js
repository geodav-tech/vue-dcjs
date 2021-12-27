module.exports = {
  banner: true,
  output: {
    extractCSS: false,
    dir: 'bundle'
  },
  plugins: {
    vue: {
      css: true
    }
  }
};