module.exports = {
  base: '/vuepress-plugin-playground/',
  title: 'Vuepress Playground Plugin',
  dest: require('path').resolve(__dirname, '../docs'),
  plugins: [
    [
      require('../lib'),
      {
        componentTag: 'playground-custom'
      }
    ]
  ],
  themeConfig: {
    repo: 'AngusFu/vuepress-plugin-playground',
    editLinks: true,
    editLinkText: '在 GitHub 上编辑此页',
    lastUpdated: '上次更新'
  }
}
