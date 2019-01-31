module.exports = {
  base: '/vuepress-plugin-playground',
  title: 'Vuepress Playground Plugin',
  dest: require('path').resolve(__dirname, '../docs'),
  plugins: [require('../lib')]
}
