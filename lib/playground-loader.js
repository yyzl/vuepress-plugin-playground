const { getOptions } = require('loader-utils')

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
      const path = await ctx.writeTemp(`${tag}.vue`, content)
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
}
