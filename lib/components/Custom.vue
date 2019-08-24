<template>
  <div class="playground">
    <div class="stage">
      <slot name="demo"></slot>
    </div>

    <input type="checkbox" class="source-toggle-checkbox" tabindex="-1" aria-hidden="true" />

    <div class="source-toggle-label">
      <label aria-hidden="true"></label>
    </div>
    <slot name="code"></slot>
  </div>
</template>

<script>
export default {
  props: ['source']
}
</script>
