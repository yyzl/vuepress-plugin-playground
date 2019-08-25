const { getOptions } = require('loader-utils')
const rollupSimpleSFC = require('./utils/rollupSimpleSFC')

module.exports = async function(src) {
  const { markdown } = getOptions(this)

  if (markdown) {
    const md = markdown()
    const data = md && md.$data
    if (data && data.compRegistry) {
      const map = data.compRegistry

      if (map.size) {
        const promises = [...map.entries()].map(([key, value]) =>
          rollupSimpleSFC({
            source: value,
            moduleName: key,
            filename: this.resourcePath + '?' + key + '.vue'
          })
        )

        const keys = [...map.keys()]
        const results = await Promise.all(promises)

        return [
          src,
          ...results.map(({ style }) =>
            style ? `<style>${style}</style>` : ''
          ),
          `<script>`,
          results.map(({ script }) => script).join('\n'),
          'export default {',
          `  components: { ${keys.join(', ')} }`,
          '}',
          '</script>'
        ].join('\n')
      }
    }
  }

  return src
}
