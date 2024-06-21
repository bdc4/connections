<template>
  <v-btn 
  :width="size.width" 
  :height="height">
    <p :style="`font-size: ${textWidth}%; white-space: break-spaces;`" v-html="finalText"></p>
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
    finalText () {
      return this.splitText.join('<br/>');
    },
    splitText () {
      return this.text.split(' ');
    },
    longestWord () {
      var splitChar = this.text.includes('-') ? '-' : ' ';
      var s = this.text.split(splitChar)
      var lw = s[0];
      s.forEach(word => {
        if (word.length > lw) {
          lw = word;
        }
      });
      return lw;
    },
    textWidth () {
      return (100 / (Math.max(this.longestWord.length, 6) / 6)) + '';
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