const { join, resolve } = require('path')
const { writeFileSync } = require('fs')

module.exports = function playgroundPlugin(options, ctx) {
  return {
    name: 'vuepress-plugin-playground',
    chainWebpack(config) {
      config.resolve.alias.set('@playground', ctx.tempPath)

      const mdRule = config.module.rule('markdown')
      const mdLoader = mdRule.uses.get('markdown-loader')
      mdRule.uses.delete('markdown-loader')
      mdRule
        .use('playground-loader')
        .loader(require.resolve('./playground-loader.js'))
        .options({ ctx })
      mdRule.uses.set('markdown-loader', mdLoader)
    },
    chainMarkdown(config) {
      config.plugin('playground-transform').use(mdDemoTransform.bind(null, ctx))
    },
    enhanceAppFiles: resolve(__dirname, './enhanceAppFile.js')
  }
}

function mdDemoTransform(ctx, md) {
  const RE_MARKER = /@playground\s*/
  const fence = md.renderer.rules.fence
  let id = 0

  md.renderer.rules.fence = (...args) => {
    const [tokens, idx] = args
    const token = tokens[idx]
    const rawCode = fence(...args)
    const lang = token.info.trim()

    // lang is `html` or `vue`
    if (lang === 'html' || lang === 'vue') {
      let content = token.content
      if (content.startsWith('@playground')) {
        const tag = `InlinePlaygroud${id++}`
        content = content
          // remove annotation
          .replace(RE_MARKER, '')
          // ensure <style> is scoped
          .replace(/\<style([^>]*)\>/g, (match, g1) => {
            if (match.indexOf('scoped') < 0) {
              return `<style scoped${g1}>`
            }
            return match
          })
        writeFileSync(join(ctx.tempPath, `${tag}.vue`), content)

        return rawCode
          .replace(RE_MARKER, '')
          .replace(/class="language-html(?=[\s"])/, 'class="language-vue')
          .replace(
            '<!--beforebegin-->',
            `<!--beforebegin--><div class="playground"><div class="stage"><${tag} /></div>`
          )
          .replace('<!--afterend-->', '</div><!--afterend-->')
      }
    }

    return rawCode
  }
}
