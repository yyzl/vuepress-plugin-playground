const { resolve } = require('path')
const md5 = require('./utils/md5')
const normalizeVue = require('./utils/normalizeVue')

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
          get markdown() {
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
      const fn = transform.bind(null, options, ctx)
      config.plugin('codeDemoTransform').use(fn)
    }
  }
}

function transform(options, ctx, md) {
  const annotations = ['@demo', '@effect-only']
  const stage = options.componentTag || 'VuepressPlaygroudDefault'
  const isValidAnnotation = t => annotations.includes(t)
  const fence = md.renderer.rules.fence

  md.renderer.rules.fence = (...args) => {
    const inlineComps =
      md.$data.inlineComps || (md.$data.inlineComps = new Map())

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

    // const absPath = join(ctx.sourceDir, args[3].relativePath)
    const content = token.content
    const tag = `InlinePlay${md5(content)}`
    const parsed = normalizeVue(content)

    inlineComps.set(tag, parsed.vue)

    const encoded = encodeJSON(parsed)
    const startTag = `<${stage} :source="JSON.parse(decodeURIComponent(\`${encoded}\`))">`

    if (tokenList.includes('@effect-only')) {
      return `${startTag}
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
          ${startTag}
            <template v-slot:demo>
              <${tag} />
            </template>
            <template v-slot:code>
        `
      )
      .replace('<!--afterend-->', `</template></${stage}><!--afterend-->`)
  }
}

function encodeJSON(o) {
  return encodeURIComponent(JSON.stringify(o))
}
