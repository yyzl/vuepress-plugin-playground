<template>
  <ul>
    <li v-for="i in count" :key="i">Line {{i}}</li>
  </ul>
</template>

<script>
export default {
  props: {
    count: Number
  }
}
</script>
