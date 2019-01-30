// markdown-it plugin for wrapping <pre> ... </pre>.
//
// If your plugin was chained before preWrapper, you can add additional eleemnt directly.
// If your plugin was chained after preWrapper, you can use these slots:
//   1. <!--beforebegin-->
//   2. <!--afterbegin-->
//   3. <!--beforeend-->
//   4. <!--afterend-->

const RE_VUE_SOURCE = /<!-vue-begin(\d+)--(.+)--vue-end(\1)-->/m

module.exports = md => {
  const fence = md.renderer.rules.fence
  md.renderer.rules.fence = (...args) => {
    const [tokens, idx] = args
    const token = tokens[idx]
    const rawCode = fence(...args)
    const lang = token.info.trim()
    let code = rawCode
    let demo = ''

    if (lang === 'html' || lang === 'vue') {
      const macth = code.match(RE_VUE_SOURCE)
      if (code) {
          console.log(macth)
          process.exit()
      }
      if (macth) {
        const playgrounds = md.__data.playgrounds || (md.__data.playgrounds = [])
        const tag = `VuePlayground${playgrounds.length}`
        demo = `<div class="demo"><${tag} /></div>`
        code = rawCode.replace(RE_VUE_SOURCE, '')
        playgrounds.push({ tag, content: JSON.parse(macth[2]) })
      }
    }

    const result = `<!--beforebegin-->` +
      `${demo}` +
      `<div class="language-${lang} extra-class">` +
        `<!--afterbegin-->` +
        `${code}` +
        `<!--beforeend-->` +
      `</div>` +
      `<!--afterend-->`
    return demo ? `<div class="playground">${result}</div>` : result
  }
}
