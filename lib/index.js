const { resolve } = require('path')
const normalizeVueDemo = require('./utils/normalizeVueDemo')

module.exports = function playgroundPlugin(options, ctx) {
  return {
    name: 'vuepress-plugin-playground',

    enhanceAppFiles() {
      if (options.componentTag) return null
      return resolve(__dirname, './enhanceAppFile.js')
    },

    chainWebpack(config) {
      let markdown = null
      const MD_LOADER = 'markdown-loader'
      const mdRule = config.module.rule('markdown')
      const markdownLoader = mdRule.uses.get(MD_LOADER)

      mdRule.uses.delete(MD_LOADER)

      mdRule
        .use('playground-loader')
        .loader(require.resolve('./playground-loader.js'))
        .options({
          ctx,
          markdown() {
            return markdown
          }
        })

      mdRule.uses.set(MD_LOADER, markdownLoader)
      mdRule.use(MD_LOADER).tap(options => {
        markdown = options.markdown
        return options
      })
    },

    chainMarkdown(config) {
      const fn = transform.bind(null, options)
      config.plugin('codeDemoTransform').use(fn)
    }
  }
}

function transform(options, md) {
  const stage = options.componentTag || 'VuepressPlaygroudDefault'
  const annotations = ['@demo', '@effect-only']
  const isValidAnnotation = t => annotations.includes(t)
  const fence = md.renderer.rules.fence

  md.renderer.rules.fence = (...args) => {
    const compRegistry = md.$data.compRegistry || new Map()
    md.$data.compRegistry = compRegistry

    const [tokens, index] = args
    const token = tokens[index]
    const tokenList = token.info.trim().split(/\s+/)
    const lang = tokenList[0]
    const hasAnnotation = tokenList.some(isValidAnnotation)

    token.info = tokenList.filter(t => !isValidAnnotation(t)).join(' ')

    // fix snippets src
    if (token.src && hasAnnotation) {
      token.src = token.src
        .replace(/\s+@(?:demo|effect-only)(?=\s+|$)/g, '')
        .trim()
    }

    const raw = fence(...args)

    // lang must be either `html` or `vue`
    if (lang !== 'html' && lang !== 'vue') {
      return raw
    }

    // must have a `@demo` annotation
    if (hasAnnotation === false) {
      return raw
    }

    const tag = nextTagName()
    const parsed = normalizeVueDemo(token.content)
    const encoded = encodeURIComponent(JSON.stringify(parsed))
    compRegistry.set(tag, parsed.vue)

    if (tokenList.includes('@effect-only')) {
      return `<${stage} :source="JSON.parse(decodeURIComponent(\`${encoded}\`))">
        <template v-slot:demo>
          <${tag} />
        </template>
      </${stage}>`
    }

    return raw
      .replace(/class="language-html(?=[\s"])/, 'class="language-vue')
      .replace(
        '<!--beforebegin-->',
        `<!--beforebegin-->
          <${stage} :source="JSON.parse(decodeURIComponent(\`${encoded}\`))">
            <template v-slot:demo>
              <${tag} />
            </template>
            <template v-slot:code>
        `
      )
      .replace('<!--afterend-->', `</template></${stage}><!--afterend-->`)
  }
}

function nextTagName() {
  nextTagName.__current = (nextTagName.__current || 0) + 1
  return `VuepressCustomDemo${nextTagName.__current}`
}
