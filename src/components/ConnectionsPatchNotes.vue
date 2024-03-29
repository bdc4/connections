<template>
  <v-btn :color="(alreadyReadNotes ? 'info' : 'warning')" density="compact" 
  :variant="alreadyReadNotes? 'text' : 'outlined'" icon size="medium" class="ml-2">
    <v-icon v-if="alreadyReadNotes">mdi-note-text-outline</v-icon>
    <v-icon v-else>mdi-exclamation-thick</v-icon>
    <v-dialog activator="parent" v-model="openModal">
      <v-card shaped dark>
        <v-card-title class="d-flex justify-space-between">
          <div>
            {{ (`${notes.title} - ${notes.version}`) || 'Patch Notes' }}
          </div>
          <div>
            <v-btn variant="outlined" size="small" color="red" @click="readNotes()">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </div>
        </v-card-title>
        <v-card-subtitle>
          Updated: {{ notes.date }}
        </v-card-subtitle>
        <v-card-text>
          <v-alert shaped dark color="info" class="mt-2">
            <p class="text-body-2" v-html="notes.description"></p>
          </v-alert>

          <br />
          <template v-for="(set, i) in structure" :key="set[0]">
            <div :class="`body-heading-7 text-${set[3] || 'primary'}`"><v-icon :color="set[3]" class="mr-2">{{ set[2]
            }}</v-icon>{{ set[1] }}</div>
            <div class="text-subtitle-2">
              <li v-for="item in notes[set[0]]" class="my-2" :key="`${i}:${set[0]}:${item.length}`"
              v-html="item">
              </li>
            </div>

            <template>
              <v-divider />
              <br />
            </template>
          </template>
        </v-card-text>
        <v-card-actions>
          <div class="align-center d-flex flex-column justify-center text-center w-100">
            <v-btn color="info" variant="elevated" @click="readNotes">Okay!</v-btn>
          </div>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-btn>
</template>

<script setup>
import patchNotes from '../notes/patchnotes.json'
import { ref } from 'vue';

const notes = patchNotes[0];
const lastVersionChecked = localStorage.getItem('patchNotesVersion') || null;
const alreadyReadNotes = ref(lastVersionChecked == notes.version);
const isFresh = checkFresh();
var openModal = ref(!!(isFresh && !alreadyReadNotes.value && lastVersionChecked === null));

const structure = [
  ['updates', 'Updates', 'mdi-new-box', 'success'],
  ['fixes', 'Bug Fixes', 'mdi-bug', 'warning'],
  ['comingSoon', 'Coming Soon!', 'mdi-clock', 'info']
]

const readNotes = function() {
  openModal.value = false;
  localStorage.setItem('patchNotesVersion', notes.version);
  alreadyReadNotes.value = true;
}

function addDays(days, inputDate) {
    var date = new Date(inputDate);
    date.setDate(date.getDate() + days);
    return date;
}

function checkFresh() {
  var notesDate = new Date(notes.date);
  var expiryDate = new Date(addDays(5, notesDate));
  var today = new Date();

  return (notesDate < today && today < expiryDate);
}

</script>
