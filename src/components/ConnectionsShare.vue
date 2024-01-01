
<template>


  <DefineTemplate>
    <v-snackbar v-model="copySuccess" color="success">Copied to Clipboard!</v-snackbar>
    <v-card>
      <v-card-title>
        {{ message || 'Share Your Results!' }}
      </v-card-title>
      <v-card-text>
        <h3>{{ title }}</h3>
        <c-tracker ref="tracker" :tracker="tracker"></c-tracker>
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

  <v-btn v-if="!openOnLoad" color="success" max-height="100px" variant="elevated" @click="shareAnswers(openOnClick)" block>
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
  <!--component :is="(openOnLoad ? 'template' : 'v-dialog')" v-model="open" class="text-center">
    
    <v-snackbar v-model="copySuccess" color="success">Copied to Clipboard!</v-snackbar>
    <v-card>
      <v-card-title>
        {{ message || 'Share Your Results!' }}
      </v-card-title>
      <v-card-text>
        <h3>{{ title }}</h3>
        <c-tracker ref="tracker" :tracker="tracker"></c-tracker>
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
  </component-->
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
    message: String
  },
  data() {
    return {
      open: false,
      shareFailed: false,
      copySuccess: false
    }
  },
  mounted () {
    if (this.openOnLoad) this.open = true;
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
      const element = this.$refs.tracker.$refs.tracker;
      const text = element.innerText || element.text;
      return text;
    }
  }
}
</script>