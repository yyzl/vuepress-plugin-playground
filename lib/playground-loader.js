module.exports = async function(src) {
  const re = /\<(InlinePlaygroudX[a-z\d]{5}) \/\>/g
  const imports = []
  const components = []

  while (true) {
    let result = re.exec(src)
    if (!result) break

    const tag = result[1]
    components.push(tag)
    imports.push(`import ${tag} from "@playground/${tag}.vue"`)
  }

  return `${src}
<script>
${imports.join('\n')}
export default {
  components: { ${components.join(',')} }
}
</script>`
}
