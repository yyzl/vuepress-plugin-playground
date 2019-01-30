const { join } = require("path");
const { writeFileSync } = require("fs");

module.exports = {
  plugins: [playgroundPlugin]
};

const playgroudTempPath = join(process.cwd(), ".playground");
function playgroundPlugin(options, ctx) {
  return {
    chainWebpack(config) {
      config.resolve.alias.set("@playground", playgroudTempPath);

      const mdRule = config.module.rule("markdown");
      const mdLoader = mdRule.uses.get("markdown-loader");
      mdRule.uses.delete("markdown-loader");
      mdRule
        .use("playground-loader")
        .loader(require.resolve("./playground.js"))
        .options({ ctx });
      mdRule.uses.set("markdown-loader", mdLoader);
    },

    chainMarkdown(config) {
      config
        .plugin("playground-wrapper")
        .use(playgroundWrapper.bind(null, ctx));
    }
  };
}
function playgroundWrapper(ctx, md) {
  const RE_MARKER = /@playground\s*/;
  const fence = md.renderer.rules.fence;
  let id = 0;

  md.renderer.rules.fence = (...args) => {
    const [tokens, idx] = args;
    const token = tokens[idx];
    const rawCode = fence(...args);
    const lang = token.info.trim();

    // lang is `html` or `vue`
    if (lang === "html" || lang === "vue") {
      let content = token.content;
      if (content.startsWith("@playground")) {
        const tag = `InlinePlaygroud${id++}`;
        writeFileSync(
          join(playgroudTempPath, `${tag}.vue`),
          content.replace(RE_MARKER, "")
        );
        return `<${tag} />${rawCode.replace(RE_MARKER, "")}`;
      }
    }
    return rawCode;
  };
}
