<template>
  <v-btn 
  :width="size.width" 
  :height="height">
    <p :style="`font-size: ${textWidth}%;`">{{ text }}</p>
    <v-badge v-if="showHint" class="hint-badge" :color="cData.color"></v-badge>
  </v-btn>
</template>

<script>
export default {
  props: {
    size: Object,
    text: String,
    cData: Object,
    showHint: Boolean
  },
  computed: {
    height () {
      return this.size.height.includes('%') ? this.size.height : Math.min(size.width, size.height)
    },
    level () {
      return this.cData.level;
    },
    info () {
      return this.cData.members;
    },
    textWidth () {
      return (100 / (Math.max(this.text.length, 6) / 6)) + '';
    }
  }
}
</script>

<style lang="css">
.hint-badge {
  position: absolute;
  left: 15px;
  top: 10px;
}
.c-btn-text {
  font-size: 2vmin;
}
</style>