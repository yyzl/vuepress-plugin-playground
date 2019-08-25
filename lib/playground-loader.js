const { getOptions } = require('loader-utils')
const rollupSFC = require('./rollup/SFC')

module.exports = async function(src) {
  const { markdown, ctx } = getOptions(this)

  if (!markdown) {
    return src
  }

  const data = markdown ? markdown.$data : null
  const map = data ? data.compRegistry : null

  if (!map || !map.size) {
    return src
  }

  const entries = [...map.entries()]
  const tags = entries.map(([, [key]]) => key)
  const imports = await Promise.all(
    entries.map(async ([hash, [tag, value]], i) => {
      const path = await ctx.writeTemp(`${hash}.vue`, value)
      return `import ${tag} from ${JSON.stringify(path)};`
    })
  )

  return [
    src,
    `<script>`,
    ...imports,
    'export default {',
    `  components: { ${tags.join(', ')} }`,
    '}',
    '</script>'
  ].join('\n')

  /*
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
  */
}
