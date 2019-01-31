module.exports = {
  base: 'vuepress-plugin-playground',
  dest: require('path').resolve(__dirname, '../docs'),
  plugins: [require('../lib')]
}
