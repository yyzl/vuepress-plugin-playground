const { getOptions } = require('loader-utils')
const cache = new Map()

module.exports = async function(src) {
  const { markdown, ctx } = getOptions(this)

  if (!markdown) {
    return src
  }

  const data = markdown ? markdown.$data : null
  const map = data ? data.inlineComps : null

  if (!map || !map.size) {
    return src
  }

  const entries = [...map.entries()]
  const tags = entries.map(([tag]) => tag)
  const imports = await Promise.all(
    entries.map(async ([tag, content], i) => {
      const path =
        cache.get(tag) || (await ctx.writeTemp(`${tag}.vue`, content))
      cache.set(tag, path)
      return `import ${tag} from ${JSON.stringify(path)};`
    })
  )

  return [
    src,
    `<script>`,
    ...imports,
    `export default { components: { ${tags.join(', ')} } }`,
    '</script>'
  ].join('\n')
}
