<template>
  <v-btn color="success" max-height="100px" variant="elevated" @click="shareAnswers(true)" block>
    <v-icon icon="mdi-share"></v-icon>share
  </v-btn>
  <v-dialog v-model="open" class="text-center">
    <v-snackbar v-model="copySuccess" color="success">Copied to Clipboard!</v-snackbar>
    <v-card>
      <v-card-title>
        Share Your Results!
      </v-card-title>
      <v-card-text>
        <h3>{{ title }}</h3>
        <ul ref="tracker" id="tracker">
          <li v-for="(row, $ind) in tracker" :key="$ind">
            <span v-for="(emoji, $$ind) in row" :key="$$ind" v-html="emoji"></span>
          </li>
        </ul>
      </v-card-text>
      <v-card-actions>
        <v-layout class="flex-column">
          <v-row v-if="!shareFailed">
            <v-col>
              <v-btn color="success" variant="elevated" @click="shareAnswers(false)" block>
                <v-icon icon="mdi-share"></v-icon>share
              </v-btn>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-btn color="primary" variant="elevated" @click="copyToClipboard()" block>
                Copy To Clipboard
              </v-btn>
            </v-col>
          </v-row>
        </v-layout>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    tracker: Array,
    puzzleId: Number
  },
  data() {
    return {
      open: false,
      shareFailed: false,
      copySuccess: false
    }
  },
  computed: {
    title() {
      return `Connections\nPuzzle #${this.puzzleId}\n`;
    }
  },
  methods: {
    async shareAnswers(openModal) {
      this.open = this.open || openModal;
      setTimeout(() => {
        try {
          var text = this.getEmojis();
          if (navigator.share) {
            navigator.share({ title: undefined, text: (this.title + text) })
              .then(() => console.log('Successful share'))
              .catch(error => console.log('Error sharing:', error));
          } else {
            this.shareFailed = true;
            throw "Share functionality not supported for device; copying to clipboard instead.";
          }
        } catch (e) {
          this.copyToClipboard();
        }
      }, 10);
    },
    copyToClipboard() {
      var text = this.getEmojis();
      navigator.clipboard.write([new ClipboardItem({
        'text/plain': new Blob([this.title + text], { type: 'text/plain' })
      })])
        .then(() => {
          this.copySuccess = true;
        })
        .catch(error => console.log('Error sharing:', error));
    },
    getEmojis() {
      const element = this.$refs.tracker;
      const text = element.innerText;
      return text;
    }
  }
}
</script>

<style>
#tracker {
  list-style: none;
  text-align: center;
}
</style>