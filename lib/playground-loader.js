const { getOptions } = require('loader-utils')
const rollupSFC = require('./rollup/SFC')

module.exports = async function(src) {
  const { markdown } = getOptions(this)

  if (!markdown) {
    return src
  }

  const md = markdown()
  const data = md ? md.$data : null
  const map = data ? data.compRegistry : null

  if (!map || !map.size) {
    return src
  }

  const promises = [...map.entries()].map(([key, value]) =>
    rollupSFC({
      source: value,
      moduleName: key,
      filename: this.resourcePath + '.demosBundle.vue'
    })
  )

  const keys = [...map.keys()]
  const results = await Promise.all(promises)

  return [
    src,
    ...results.map(({ style }) => (style ? `<style>${style}</style>` : '')),
    `<script>`,
    results.map(({ script }) => script).join('\n'),
    'export default {',
    `  components: { ${keys.join(', ')} }`,
    '}',
    '</script>'
  ].join('\n')
}
