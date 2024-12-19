<template>
  <v-btn color="info" block>
    <v-icon icon="mdi-help-circle-outline"></v-icon>Hint Menu
    <v-dialog activator="parent" v-model="openModal">
      <v-card class="c-hint-modal">
        <v-card-title>
          Need a Hint? 🤡
        </v-card-title>
        <v-card-text class="text-center c-hint-buttons">
          <div>
            <v-container>
              <v-row v-if="selected.length" class="text-center c-define-row">
                <v-col cols="12">Look up definition for...</v-col>
                <v-col :cols="selected.length > 1 ? '6' : '12'" v-for="word in selected" :key="word">
                  <ConnectionsDefine :word="word"></ConnectionsDefine>
                </v-col>
              </v-row>
              <v-row justify="center">
                <div v-if="selected.length && selected.length >= 2">

                  <v-btn class="flex-column" color="info" variant=outlined @click="checkTwo(wordOne, wordTwo)">
                    <div class="flex-column">
                      <div>🤡 Check if</div>
                      <div>
                        <span class="text-secondary ml-1 mr-1 bold">{{ wordOne }}</span> and
                        <span class="text-secondary ml-1 mr-1">{{ wordTwo }}</span>
                      </div>
                      <div>go together</div>
                    </div>
                  </v-btn>
                </div>
              </v-row>
              <v-row justify="center">
                <div>
                  <v-btn color="info" variant=outlined @click="getTwoRandom()">🤡 Get two random matches</v-btn>
                </div>
              </v-row>
            </v-container>
          </div>
        </v-card-text>
        <v-card-actions>
          <v-btn color="danger" @click="openModal = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-btn>
</template>

<script setup>
import { ref, defineProps, computed } from 'vue';
import ConnectionsDefine from './ConnectionsDefine.vue';

const props = defineProps({
  selected: Object
})

const emit = defineEmits(['get-two-random', 'check-two']);

const wordOne = computed(() => props.selected[props.selected.length - 1]);
const wordTwo = computed(() => props.selected[props.selected.length - 2]);

var openModal = ref(false);
var getTwoRandom = function() {
  emit('get-two-random', {});
  this.openModal = false;
}
var checkTwo = function() {
  emit('check-two', { wordOne: wordOne.value, wordTwo: wordTwo.value });
  this.openModal = false;
}

</script>

<style lang="scss" scoped>
.c-hint-modal {
  height: 90vh;
}

.c-define-row {
  max-height: 50%;
  overflow: auto;
}

.c-hint-buttons {
  .v-btn {
    height: 80px;
    margin-top: 50px;
    width: 300px;
  }
}
</style>