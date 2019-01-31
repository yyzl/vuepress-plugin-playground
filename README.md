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

Put a `@playground` annotation to the very begining of your code, and that code block would be treated as a real SFC file.

<!-- prettier-ignore -->
~~~html {2}
```html
@playground
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

```html {16}
@playground
<template>
  <button @click="count++" :class="$style.button">
    You clicked me {{ count }} times.
  </button>
</template>

<script>
  export default {
    data() {
      return { count: 0 }
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

## Import Code Snippets

By adding a `@playground` annotation on the top of your `.vue` file, you can import code snippets via following syntax:

```
<<< @/.vuepress/snippets/test.vue
```

(SEE [vuepress doc](https://vuepress.vuejs.org/guide/markdown.html#import-code-snippets))

Result:

<<< @/.vuepress/snippets/test.vue

## Customizing Styles

You can add your own CSS using selectors like `.playground` `.stage`.

SEE following structure:

- `<div class="playground">`

  - `<div class="stage">`

    - `<InlinePlayground />`(Live demo)

  - `<div class="language-html">`(highlighted results)

## TODO

- integration with codesandbox/codepen
