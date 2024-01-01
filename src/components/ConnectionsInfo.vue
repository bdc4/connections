<template>
  <span>
    <v-icon icon="mdi-information" size="x-large" color="info" @click="open = true"></v-icon>
    <v-dialog v-model="open">
      <v-card>
        <v-card-title>How to Play</v-card-title>
        <v-card-text>
          <h3>Find groups of four items that share something in common.</h3>
          <ul class="ml-10">
            <li>Select four items and tap 'Submit' to check if your guess is correct.</li>
            <li>Find the groups without making 4 mistakes!</li>
          </ul>
          <br />
          <h3>Category Examples</h3>
          <ul class="ml-10">
            <li>FISH: Bass, Flounder, Salmon, Trout</li>
            <li>FIRE ___: Ant, Drill, Island, Opal</li>
          </ul>
          <br />
          <p>Categories will always be more specific than "5-LETTER WORDS," "NAMES" or "VERBS."</p>
          <p>Each puzzle has exactly one solution. Watch out for words that seem to belong to multiple categories!</p>
          <br />
          <div id="color-descriptions">
            <p>Each group is assigned a color, which will be revealed as you solve: </p>
            <div class="pa-2">
              <ul class="help-emojis flex-column">
                <div class="flex-row align-center">
                  <span class="help-emoji group-0"></span>
                  <span>Straightforward</span>
                </div>
                <div class="flex-row align-center">
                  <span class="help-emoji group-1"></span>
                  <span>...</span>
                </div>
                <div class="flex-row align-center">
                  <span class="help-emoji group-2"></span>
                  <span>...</span>
                </div>
                <div class="flex-row align-center">
                  <span class="help-emoji group-3"></span>
                  <span>Tricky</span>
                </div>
              </ul>
            </div>
          </div>
        </v-card-text>
        <v-card-actions class="justify-center">
          <v-btn @click="open = false" color="primary" variant="flat">Okay!</v-btn>
        </v-card-actions>
        <small>{{ appVersion }}</small>
      </v-card>
    </v-dialog>
  </span>
</template>

<script>
export default {
  data() {
    return {
      open: false
    }
  },
  computed: {
    appVersion () {
      return __APP_VERSION__;
    }
  }
}
</script>

<style>
.help-emojis {
  display: flex;
}

.help-emoji {
  display: inline-flex;
  width: 16px;
  height: 16px;
  margin-right: 5px;
  border-radius: 2px;
  margin-bottom: 1.5px;
}

.group-0 {
  background-color: #f9df6d;
}

.group-1 {
  background-color: #a0c35a;
}

.group-2 {
  background-color: #b0c4ef;
}

.group-3 {
  background-color: #ba81c5;
}</style>