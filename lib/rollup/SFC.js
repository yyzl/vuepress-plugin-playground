const rollup = require('rollup')
const VuePlugin = require('rollup-plugin-vue')
const CSSOnlyPlugin = require('rollup-plugin-css-only')
const CommonJSPlugin = require('rollup-plugin-commonjs')
const MemoryPlugin = require('./memoryPlugin')

/** @typedef {import('rollup').InputOptions} InputOptions */
/** @typedef {import('rollup').OutputOptions} OutputOptions */

module.exports = async function rollupSFC({ source, filename, moduleName }) {
  let style = null

  /** @type {InputOptions} */
  const inputOptions = {
    plugins: [
      MemoryPlugin({
        path: filename,
        contents: source
      }),
      CommonJSPlugin(),
      CSSOnlyPlugin({
        output(cssText) {
          style = cssText
        }
      }),
      VuePlugin({
        css: false
      })
    ]
  }

  try {
    const bundle = await rollup.rollup(inputOptions)
    const { output } = await bundle.generate(
      /** @type {OutputOptions} */ {
        name: moduleName,
        sourcemap: false,
        format: 'iife'
      }
    )

    return {
      style,
      script: output[0].code
    }
  } catch (e) {
    console.error(e)
    return {
      style,
      script: `var ${moduleName} = {
        render: function (h) {
          return h('pre', null, [ h('code', null, [\`${e.stack}\`]) ])
        }
      }`
    }
  }
}
