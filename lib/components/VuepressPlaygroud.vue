<template>
  <div class="playground">
    <div class="stage">
      <slot name="demo"></slot>
    </div>

    <template v-if="$scopedSlots.code">
      <input
        type="checkbox"
        :id="`__checckbox_${_uid}`"
        class="source-toggle-checkbox"
        tabindex="-1"
        aria-hidden="true"
      />

      <div class="source-toggle-label">
        <label aria-hidden="true" :for="`__checckbox_${_uid}`"></label>
      </div>

      <slot name="code"></slot>
    </template>
  </div>
</template>

<script>
export default {
  props: ['source']
}
</script>

<style>
.playground {
  margin: 1em 0;
  border: 1px solid #ddd;
  border-radius: 6px;
  overflow: hidden;
}
.playground > div {
  border-radius: 0 !important;
}
.playground > div pre {
  margin: 0 !important;
}
.playground > div[class*='language-'] {
  margin: 0;
}
.playground > .stage {
  padding: 1.5rem 1.5rem;
  border: 0;
}

.source-toggle-checkbox {
  position: absolute;
  clip: rect(0, 0, 0, 0);
  cursor: pointer;
}

.source-toggle-label > label {
  position: relative;
  display: block;
  font-size: 13px;
  line-height: 3;
  text-align: center;
  background: #fafafa;
  cursor: pointer;
  user-select: none;
}

.source-toggle-label > label:hover {
  color: #2196f3;
  background: #eff3f6;
}

.source-toggle-label > label::after {
  content: '⇓ Display source code';
}

.source-toggle-checkbox:checked + .source-toggle-label > label::after {
  content: '⇑ Hide source code';
}

:lang(zh) .source-toggle-label > label::after {
  content: '⇓ 显示代码';
}

:lang(zh)
  .source-toggle-checkbox:checked
  + .source-toggle-label
  > label::after {
  content: '⇑ 隐藏代码';
}

.source-toggle-checkbox ~ div[class*='language-'] {
  display: none;
}

.source-toggle-checkbox:checked ~ div[class*='language-'] {
  display: block;
}
</style>
