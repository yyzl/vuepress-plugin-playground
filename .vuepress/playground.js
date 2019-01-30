module.exports = async function(src) {
  const re = /\<(InlinePlaygroud\d{1,}) \/\>/g;
  const imports = [];
  const components = [];

  while (true) {
    let result = re.exec(src);
    if (!result) break;

    const tag = result[1];
    components.push(tag);
    imports.push(`import ${tag} from "@playground/${tag}"`);
  }

  const script =
    `<script>\n` +
    `${imports.join("\n")}\n` +
    `export default {\n` +
    `components: {\n` +
    `${components.join(",\n")}\n` +
    `}\n` +
    `}\n` +
    `</script>`;

  return src + script;
};
