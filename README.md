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

Write SFC-styled code in a [fenced code block](https://spec.commonmark.org/0.28/#fenced-code-blocks) with `lang` attr being `vue` or `html`.

Put a `@playground` declaration to the very begining of your code, and that code block would be treated as a real SFC file.

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

```html
@playground
<template>
  <button @click="count++">You clicked me {{ count }} times.</button>
</template>

<script>
  export default {
    data() {
      return { count: 0 }
    }
  }
</script>

<style>
  button {
    line-height: 2;
    font-size: 14px;
    padding: 0 1em;
  }
</style>
```

## Style

You can add your own CSS using selectors like `.playground` `.stage`.

SEE following structure:

- `<div class="playground">`

  - `<div class="stage">`

    - `<InlinePlayground />`(Live demo)

  - `<div class="language-html">`(highlighted results)

## TODO

- integration with codesandbox/codepen
