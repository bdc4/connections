<template>
  <v-dialog v-model="open">
    <template v-slot:activator="{ attrs }">
      <v-btn :disabled="!word" @click="defineWord(props.word)" v-bind="attrs" width="140" block>
        <v-icon>mdi-book</v-icon> {{ word || 'define' }}
      </v-btn>
    </template>

    <v-card>
      <v-card-title>
        Definitions for: <span class="text-primary">{{ props.word }}</span>
      </v-card-title>
      <v-card-text class="pa-0">
        <template>
          <div class="text-center">
            <v-pagination v-model="page" :length="4" prev-icon="mdi-menu-left" next-icon="mdi-menu-right"></v-pagination>
          </div>
        </template>
        <v-expansion-panels v-if="definitions.length" v-model="panel">
          <v-expansion-panel v-for="(source, ind) in definitions" :key="ind" color="info">
            <v-expansion-panel-title>
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
</template>

  

<script setup>
import { computed, ref } from 'vue'
import axios from 'axios'

const props = defineProps({
  word: { type: String }
});

var definitions = ref([]);
var open = ref(!!(definitions.length));
var panel = ref(0);
var page = ref(1);

const defineWord = async function (word) {
  definitions.value = [];
  open.value = true;
  axios.get(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)
    .then(res => {
      var i =0;
      console.log(res.data)
      definitions.value = res.data;
      // TODO: check if data valid
    });
}
</script>