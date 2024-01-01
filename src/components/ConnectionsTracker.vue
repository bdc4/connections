<template>
  <ul ref="tracker" id="tracker">
    <li v-for="(row, $ind) in tracker" :key="$ind">
      <span v-for="(emoji, $$ind) in row" :key="$$ind" v-html="emoji"></span>
    </li>
  </ul>
</template>

<script>
export default {
  props: {
    tracker: Array
  }
}
</script>

<style>
#tracker {
  list-style: none;
  text-align: center;
}
</style>