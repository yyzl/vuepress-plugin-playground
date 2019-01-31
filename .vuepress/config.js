module.exports = {
  base: '/vuepress-plugin-playground/',
  title: 'Vuepress Playground Plugin',
  dest: require('path').resolve(__dirname, '../docs'),
  plugins: [require('../lib')],
  serviceWorker: true,
  themeConfig: {
    repo: 'AngusFu/vuepress-plugin-playground',
    editLinks: true,
    editLinkText: '在 GitHub 上编辑此页',
    lastUpdated: '上次更新',
    serviceWorker: {
      updatePopup: {
        message: '发现新内容可用',
        buttonText: '刷新'
      }
    }
  }
}
