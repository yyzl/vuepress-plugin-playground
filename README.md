---
sidebar: auto
---

# Vuepress Playground Plugin

[![npm status](https://img.shields.io/npm/v/vuepress-plugin-playground.svg)](https://www.npmjs.org/package/vuepress-plugin-playground)

::: warning
According to the [SFC Spec](https://vue-loader.vuejs.org/spec.html#script), "each \*.vue file can contain at most one \<script\> block at a time."

Please DO NOT use `<script>` tags in your markdown file for importing or declaring purposes.
:::

## Example

Take a look at [demo](https://github.com/AngusFu/webgl-guide-reading).

## Install

```bash
npm install -D vuepress-plugin-playground
```

```js
// in your .vuepress/config.js
module.exports = {
  plugins: [require('vuepress-plugin-playground')]
}
```

## Usage

You can write SFC-styled code in a [fenced code block](https://spec.commonmark.org/0.28/#fenced-code-blocks) with `lang` attr being `vue` or `html`.

Put a `@demo` annotation in your code block, and it would be treated as a real SFC file:

- <code>\`\`\`vue @demo</code>
- <code>\`\`\`html @demo</code>

<!-- prettier-ignore -->
~~~html {2}
```html @demo
<template>
  ...
</template>

<script>
  export default {}
</script>

<style>
  /* Your CSS code here */
</style>
```
~~~

Following is a counter example:

```html @demo {11}
<template>
  <div>
    <button @click="count++" :class="$style.button">
      You clicked me {{ count }} times.
    </button>
    <lines-component :count="count" />
  </div>
</template>

<script>
  // DO NOT recommand importing external resources
  import LinesComponent from './.vuepress/snippets/lines.vue'

  export default {
    components: { LinesComponent },
    data() {
      return { count: 1 }
    },
    mounted() {}
  }
</script>

<!-- Notice that style tags are ALWAYS treated as scoped -->
<style>
  button {
    line-height: 2;
    padding: 0 1em;
  }
</style>

<style module scoped>
  .button {
    font-size: 14px;
    font-weight: bold;
  }
</style>
```

## Display Without Source Code

Use the `@effect-only` annotation ——

<!-- prettier-ignore -->
~~~html {1}
```html @effect-only
<template>
  <h3>Source code is gone~</h3>
</template>
```
~~~

Here is the result ——

```html @effect-only
<template>
  <h3>Source code is gone...</h3>
</template>
```

## Import Code Snippets

You can import code snippets via following syntax:

```{1,2}
<<< @/.vuepress/snippets/test.vue @demo {1,2}
<<< @/.vuepress/snippets/test.vue @effect-only
```

(SEE [vuepress doc](https://vuepress.vuejs.org/guide/markdown.html#import-code-snippets))

Result:

<<< @/.vuepress/snippets/test.vue @demo {1,2}

<<< @/.vuepress/snippets/test.vue @effect-only

## Customize Styles

```xml
<GlobalCustomStage :source="source">
  <slot name="name">
  <slot name="code">
</GlobalCustomStage>
```

- `source.vue`
- `source.template`
- `source.templateAttrs`
- `source.script`
- `source.scriptAttrs`
- `source.styleAttrs`

## TODO

- [] Integration with codesandbox/codepen/jsbin
