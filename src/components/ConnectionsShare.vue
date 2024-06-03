<template>
  <DefineTemplate>
    <v-snackbar v-model="copySuccess" color="success">Copied to Clipboard!</v-snackbar>
    <v-snackbar v-model="copyFailed" color="danger">Unable to copy to clipboard. Your browser might not be
      supported!</v-snackbar>
    <v-card>
      <v-card-title>
        {{ message || 'Share Your Results!' }}
      </v-card-title>
      <v-card-text>
        <h3>{{ shareTitle }}</h3>
        <c-tracker ref="tracker" :tracker="tracker"></c-tracker>
      </v-card-text>
      <v-card-actions>
        <v-layout class="flex-column">
          <v-row>
            <v-text-field placeholder="(Optional) Include a message!" v-model="shareMessage"></v-text-field>
          </v-row>
          <v-row v-if="!shareFailed">
            <v-col>
              <v-btn color="success" variant="elevated" @click="shareAnswers(false)" block>
                <v-icon icon="mdi-share"></v-icon>share
              </v-btn>
            </v-col>
          </v-row>
          <v-row v-else>
            <v-col>
              <v-btn color="primary" variant="elevated" @click="copyToClipboard()" block>
                <v-icon icon="mdi-clipboard-multiple-outline"></v-icon>Copy To Clipboard
              </v-btn>
            </v-col>
          </v-row>
        </v-layout>
      </v-card-actions>
    </v-card>
  </DefineTemplate>

  <!-- MAIN -->
  <v-btn :style="`height: ${shareHeight}`" v-if="!openOnLoad" color="success" max-height="100px" variant="elevated"
    @click="shareAnswers(openOnClick)" block>
    <v-icon icon="mdi-share"></v-icon>share
  </v-btn>

  <v-dialog v-if="!openOnLoad" v-model="open" class="text-center">
    <ReuseTemplate></ReuseTemplate>
  </v-dialog>
  <template v-else>
    <div class="text-center">
      <ReuseTemplate></ReuseTemplate>
    </div>
  </template>
</template>

<script>
import { createReusableTemplate } from '@vueuse/core';
import ConnectionsTracker from './ConnectionsTracker.vue';

const [DefineTemplate, ReuseTemplate] = createReusableTemplate()

export default {
  components: {
    cTracker: ConnectionsTracker,
    DefineTemplate, ReuseTemplate
  },
  props: {
    tracker: Array,
    puzzleId: Number,
    openOnClick: Boolean,
    openOnLoad: Boolean,
    message: String,
    shareHeight: String
  },
  data() {
    return {
      open: false,
      shareFailed: false,
      copySuccess: false,
      copyFailed: false,
      shareMessage: ''
    }
  },
  mounted() {
    if (this.openOnLoad) this.open = true;
  },
  computed: {
    shareTitle() {
      return `Connections\n${this.puzzleId}\n`;
    }
  },
  methods: {
    async shareAnswers(openModal) {
      this.open = this.open || openModal;
      setTimeout(() => {
        try {
          var text = this.getEmojis();
          if (navigator.share) {
            navigator.share({ title: undefined, text: (this.shareTitle + text + this.shareMessage) })
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
      try {
        navigator.clipboard.write([new ClipboardItem({
          'text/plain': new Blob([this.shareTitle + text + this.shareMessage], { type: 'text/plain' })
        })])
          .then(() => {
            this.copySuccess = true;
          })
          .catch(error => {
            console.log('Error copying to clipboard:', error)
            this.copyFailed = true;
          });
      } catch (e) {
        console.log('Error copying to clipboard:', e)
        this.copyFailed = true;
      }
    },
    getEmojis() {
      const element = this.$refs.tracker.$refs.tracker;
      const text = element.innerText || element.text;
      return text;
    }
  }
}
</script>