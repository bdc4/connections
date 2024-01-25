<template>
  <div ref="tracker" id="tracker" class="align-center d-flex flex-column">
    <div>
      <div v-for="(row, $ind) in tracker" :key="$ind">
        <span v-for="(emoji, $$ind) in row" :key="$$ind" v-html="emoji"></span>
      </div>
      <!--div v-if="tracker.length == 4 && !hintsUsed">
        <span>🤩🤩🤩🤩</span>
      </div-->
    </div>
  </div>
</template>

<script>
export default {
  props: {
    tracker: Array
  },
  computed: {
    hintsUsed () {
      var used = false;
      this.tracker.forEach(row => {
        used = used || row.includes('🤡');
      });

      return used;
    },
    star () {
      return (this.tracker.length == 4 && !this.hintsUsed) ? '⭐️' : '';
    }
  }
}
</script>

<style>
#tracker {
  list-style: none;
  text-align: left;
}
</style>