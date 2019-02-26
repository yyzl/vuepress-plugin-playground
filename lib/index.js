const { join, resolve } = require('path')
const { writeFileSync } = require('fs')
const normalizeVueDemo = require('./utils/normalizeVueDemo')

module.exports = function playgroundPlugin(options, ctx) {
  return {
    name: 'vuepress-plugin-playground',
    chainWebpack(config) {
      config.resolve.alias
        .set('@playground', ctx.tempPath)
        .set('@cwd', process.cwd())

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

  md.renderer.rules.fence = (...args) => {
    const [tokens, index] = args
    const token = tokens[index]
    const rawCode = fence(...args)
    const lang = token.info.trim()

    // lang must be `html` or `vue`
    if (lang !== 'html' && lang !== 'vue') {
      return rawCode
    }

    let content = token.content
    // must have a `@playgroud` annotation
    if (content.startsWith('@playground') === false) {
      return rawCode
    }

    const tag = `InlinePlaygroudI${index}H${md5(content)}`

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

    const {
      sfc,
      demoOnly
      // template,
      // templateAttrs,
      // script,
      // scriptAttrs,
      // style,
      // styleAttrs
    } = normalizeVueDemo(content)

    // TODO
    // if we only get template
    // just write inline...
    // 'export default {}'
    writeFileSync(join(ctx.tempPath, `${tag}.vue`), sfc)

    if (demoOnly) {
      return `<div class="playground"><div class="stage"><${tag} /></div></div>`
    }

    return rawCode
      .replace(RE_MARKER, '')
      .replace(/class="language-html(?=[\s"])/, 'class="language-vue')
      .replace(
        '<!--beforebegin-->',
        `<!--beforebegin-->
          <div class="playground">
            <div class="stage"><${tag} />
          </div>
          <input type="checkbox" id="__${tag}" class="source-toggle-checkbox" tabindex="-1" aria-hidden="true">
          <div class="source-toggle-label">
            <label aria-hidden="true" for="__${tag}"></label>
          </div>
        `
      )
      .replace('<!--afterend-->', '</div><!--afterend-->')
  }
}

function md5(str) {
  const crypto = require('crypto')
  const md5 = crypto.createHash('md5')
  md5.update(str)
  return md5.digest('hex').slice(-5)
}
