<template>
  <v-btn 
  :width="size.width" 
  :height="height">
    {{ text }}
  </v-btn>
</template>

<script>
export default {
  props: {
    size: Object,
    text: String
  },
  computed: {
    height () {
      return this.size.height.includes('%') ? this.size.height : Math.min(size.width, size.height)
    }
  }
}
</script>