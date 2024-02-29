<template>
  <div>
    <!-- Activator Button -->
    <v-tooltip v-model="noDefinition" :open-on-hover="false" location="top">
      <template v-slot:activator="{ props }">
        <v-btn v-bind="props" @click="defineWord(word)" :disabled="!word" width="140" block>
          <span>
            <v-icon v-if="!loading">mdi-book</v-icon>
            <v-progress-circular v-else indeterminate :size="18"></v-progress-circular>
          </span>
          {{ word || 'define' }}
        </v-btn>
      </template>
      <span>No Definition Found</span>
    </v-tooltip>

    <v-dialog v-model="open.value">

      <!-- Popup -->
      <v-card>
        <v-card-title>
          Definitions for: <span class="text-primary">{{ word }}</span>
        </v-card-title>
        <v-card-text class="pa-0">
          <template>
            <div class="text-center">
              <v-pagination v-model="page" :length="4" prev-icon="mdi-menu-left"
                next-icon="mdi-menu-right"></v-pagination>
            </div>
          </template>
          <v-expansion-panels v-if="definitions.length" v-model="panel" :disabled="definitions.length == 1">
            <v-expansion-panel v-for="(source, ind) in definitions" :key="ind" color="info">
              <v-expansion-panel-title v-if="definitions.length > 1">
                {{ ind + 1 }}. {{ source.word }}
              </v-expansion-panel-title>
              <v-expansion-panel-text>
                <template v-for="(meaning, indd) in source.meanings" :key="`${ind}:${indd}`">
                  <br v-if="indd > 0" />
                  <i class="text-info">{{ meaning.partOfSpeech }}</i>
                  <div>
                    <div class="text-body-2" style="max-height: 180px; overflow: scroll; list-style-position: inside;">
                      <ul>
                        <li v-for="(def, inddd) in meaning.definitions" :key="`${ind}:${indd}:${inddd}`">
                          <!-- :style="{fontSize: `${Math.max(.7, (1 - (.05 * inddd)))}em`}" -->
                          {{ def.definition }}
                        </li>
                      </ul>
                    </div>
                  </div>
                  <template v-if="meaning.synonyms && meaning.synonyms.length">
                    <br />
                    <i class="text-secondary text-caption">Synonyms</i>
                    <div>
                      <v-chip v-for="syn in meaning.synonyms" :key="syn" size="x-small" class="mx-1">{{ syn }}</v-chip>
                    </div>
                  </template>
                  <br />
                  <v-divider></v-divider>
                </template>
              </v-expansion-panel-text>
            </v-expansion-panel>
          </v-expansion-panels>
          <v-container v-else class="fill-height flex-column">
            <v-progress-circular indeterminate color="info" label="loading">
            </v-progress-circular>
          </v-container>
        </v-card-text>
        <v-card-actions>

        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

  

<script setup>
import { computed, ref, watch } from 'vue'
import axios from 'axios'

const props = defineProps({
  word: { type: String }
});

var definitions = ref([]);
var loading = ref(false);
var open = ref({
  value: !!(definitions.length)
});
var panel = ref(0);
var page = ref(1);
var noDefinition = ref(false);
var defTimeout = ref();

watch(noDefinition, (newVal, oldVal) => {
  if (newVal === true && oldVal === false) {
    defTimeout.value = setTimeout(() => {
      noDefinition.value = false;
    }, 3000);
  } else if (defTimeout.value) {
    clearTimeout(defTimeout.value);
  }
})

const defineWord = async function (word) {
  definitions.value = [];
  loading.value = true;
  noDefinition.value = false;
  clearTimeout(defTimeout.value);
  axios.get(`https://api.dictionaryapi.dev/api/v2/entries/en/${word.toLowerCase()}`)
    .then(res => {
      var i = 0;
      definitions.value = res.data;
      open.value.value = true;
      // TODO: check if data valid
    })
    .catch(error => {
      console.warn(`No definition found for ${word}`);
      noDefinition.value = true;
    })
    .finally(r => {
      loading.value = false;
    });

}
</script>