<template>
  <span>
    <v-icon icon="mdi-cog" size="x-large" color="info" @click="open = true"></v-icon>
    <v-dialog v-model="open">
      <v-card>
        <v-card-title>Preferences</v-card-title>
        <v-card-text>
          <v-form ref="prefForm" :disabled="!preferences.customSettings" v-model="valid" class="c-pref-form">

            <v-switch ref="hints" :class="($refs.prefForm && $refs.prefForm.disabled) ? 'c-pref-input-locked' : ''"
              :label="(preferences.unlimitedGuesses ? 'Unlimited Guesses' : 'Limited Guesses')" v-model="preferences.unlimitedGuesses"
              color="primary">
              <template v-slot:prepend v-if="!preferences.customSettings">
                <v-icon v-if="!preferences.unlimitedGuesses" icon="mdi-cancel" color="red"></v-icon>
                <v-icon v-else icon="mdi-check" color="success"></v-icon>
              </template>
            </v-switch>

              <v-switch ref="hints" :class="($refs.prefForm && $refs.prefForm.disabled) ? 'c-pref-input-locked' : ''"
              :label="(preferences.showHints ? 'Hints Allowed' : 'No Hints Allowed')" v-model="preferences.showHints"
              color="primary">
              <template v-slot:prepend v-if="!preferences.customSettings">
                <v-icon v-if="!preferences.showHints" icon="mdi-cancel" color="red"></v-icon>
                <v-icon v-else icon="mdi-check" color="success"></v-icon>
              </template>
            </v-switch>

              <v-switch ref="hints" :class="($refs.prefForm && $refs.prefForm.disabled) ? 'c-pref-input-locked' : ''"
              :label="(preferences.showAwayMessages ? (`Show 'X Away...' messages`) : (`Don't show 'X Away...' messages`))" v-model="preferences.showAwayMessages"
              color="primary">
              <template v-slot:prepend v-if="!preferences.customSettings">
                <v-icon v-if="!preferences.showAwayMessages" icon="mdi-cancel" color="red"></v-icon>
                <v-icon v-else icon="mdi-check" color="success"></v-icon>
              </template>
            </v-switch>
          </v-form>
          <v-slider v-if="!preferences.customSettings" v-model="preferences.difficulty" :ticks="tickLabels" :max="2"
              step="1" show-ticks="always" tick-size="0" :color="labelColors[preferences.difficulty]"></v-slider>

            <v-slider v-else disabled class="c-dummy-slider" :ticks="{ 1: 'Custom' }" :max="2" step="1"
              show-ticks="always" :value="1"></v-slider>
          <template v-if="!preferences.customSettings">
            <h4>Want to change these settings?</h4>
            <p>Check the box below to mix and match to your exact preferences!</p>
          </template>
          <template v-else>
            <h4>Want to play on a certain difficulty?</h4>
            <p>Uncheck the box below to choose a pre-configured challenge!</p>
          </template>

          <v-checkbox label="Custom Settings" v-model="preferences.customSettings"></v-checkbox>
        </v-card-text>
        <v-card-actions class="justify-center">
          <v-btn @click="savePreferences()" color="primary" variant="flat">Save</v-btn>
          <v-btn color="red" variant="flat" @click="open = false">Close</v-btn>
        </v-card-actions>
      </v-card>
      <v-snackbar color="success" v-model="saveSuccess">Preferences Saved!</v-snackbar>
    </v-dialog>
  </span>
</template>

<script>
export default {
  data() {
    return {
      open: false,
      valid: true,
      preferences: {},
      difficulties: ['Easy', 'Normal', 'Hard'],
      tickLabels: {
        0: 'Easy',
        1: 'Normal',
        2: 'Hard'
      },
      labelColors: ['success', 'warning', 'red'],
      saveSuccess: false
    }
  },
  mounted() {
    this.preferences = { ...this.$store.state.preferences };
  },
  computed: {
  },
  watch: {
    'preferences.difficulty': {
      handler: 'setDifficulty'
    },
    'preferences.customSettings': {
      handler: function (newVal, oldVal) {
        if (newVal == false && oldVal == true) {
          this.setDifficulty();
        }
      }
    }
  },
  methods: {
    setDifficulty() {
      const diff = this.preferences.difficulty;
      switch (diff) {
        case 0:
          this.preferences.showHints = true;
          this.preferences.showAwayMessages = true;
          this.preferences.unlimitedGuesses = true;
          break;

        case 1:
          this.preferences.showHints = false;
          this.preferences.showAwayMessages = true;
          this.preferences.unlimitedGuesses = false;
          break;

        case 2:
          this.preferences.showHints = false;
          this.preferences.showAwayMessages = false;
          this.preferences.unlimitedGuesses = false;
          break;
      }
    },
    async savePreferences() {
      await this.$store.commit('save', {
        id: 'preferences', value: this.preferences
      })
      this.saveSuccess = true;
    }
  }
}
</script>

<style>
.c-dummy-slider .v-slider-thumb {
  display: none;
}
.c-pref-input-locked .v-selection-control__wrapper {
  display: none;
}
</style>
