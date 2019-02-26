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

Put a `@playground` annotation (or `@demo`, which is shorter) to the very begining of your code, and that code block would be treated as a real SFC file.

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

```html {14,25}
@playground
<template>
  <div>
    <button @click="count++" :class="$style.button">
      You clicked me {{ count }} times.
    </button>
    <lines-component :count="count" />
  </div>
</template>

<script>
  // for imports, please use `@cwd/` (your project root),
  // relative paths are NOT supported yet.
  // of course, you can also use your own webpack aliases.
  import LinesComponent from '@cwd/.vuepress/snippets/lines.vue'

  export default {
    components: { LinesComponent },
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

By adding a `@playground` or `@demo` annotation on the top of your `.vue` file, you can import code snippets via following syntax:

```
<<< @/.vuepress/snippets/test.vue
```

(SEE [vuepress doc](https://vuepress.vuejs.org/guide/markdown.html#import-code-snippets))

Result:

<<< @/.vuepress/snippets/test.vue

## Display Without Source Code

Add a `demo-only` attribute onto your `<template>` tag ——

<!-- prettier-ignore -->
~~~html {3}
```html
@playground
<template demo-only>
  <h3>Source code is missing~</h3>
</template>
```
~~~

Here is the result ——

```html
@playground
<template demo-only>
  <h3>Source code is missing...</h3>
</template>
```

## Customize Styles

You can add your own CSS using selectors like `.playground` `.stage`.

SEE following structure:

- `<div class="playground">`

  - `<div class="stage">`

    - `<InlinePlayground />`(Live demo)

  - `<div class="language-html">`(highlighted results)

## TODO

- integration with codesandbox/codepen
