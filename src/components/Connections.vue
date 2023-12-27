<template>
  <div>
    <!--template v-html="tracker.join(`&\#13;`)" ref="tracker"></template-->
    <ul ref="tracker" class="tracker-ul">
      <li v-for="(row, $ind) in tracker" :key="$ind">
        <span v-for="(emoji, $$ind) in row" :key="$$ind" v-html="emoji"></span>
      </li>
    </ul>
    <div>
      <ConfettiExplosion v-if="triggerConfetti" :particle-count="100"
        :style="`position: absolute; left: ${window.width / 2}px; top: ${window.height / 2}px;`" />
      <v-snackbar v-model="showAlert" location="center" :color="snackbar.color" max-width="80" timeout="1500"
        content-class="text-center">
        <span>{{ snackbar.message }}</span>
      </v-snackbar>
    </div>

    <v-container>
      <v-row class="justify-space-between pa-3" style="height: 100vh;">
        <!-- HEADER ROW -->
        <v-row>
          <v-col cols="9">
            <h3>Connections 2.0</h3>
            <div>{{ this.currentDate }}</div>
          </v-col>
          <v-col class="text-right" cols="3">
            <v-icon icon="mdi-cog" size="x-large"></v-icon>
            <c-info />
          </v-col>
        </v-row>

        <!-- GRID ROW -->
        <v-row class="ml-2 mr-2">
          <v-col cols="12" v-for="answer in Object.keys(answered)" :key="answer" class="pa-0 mb-2" style="height: 15vh;">
            <v-btn :height="buttonSize.height" :color="getBorderColor(answer)" block>
              <div>
                <h3>{{ answer }}</h3>
                <div>{{ answered[answer].join() }}</div>
              </div>
            </v-btn>
          </v-col>
          <!--v-col v-for="(group, $index) in grid" :key="$index" class="align-center" style="height: 15vh;"-->
          <v-col cols="3" v-for="item in grid.flat()" :key="item" class="pa-1"
            style="width: 25vw; height: 15vh; max-height: 25vw;">
            <c-btn :size="buttonSize" :text="item" :color="getSelectionColor(item)" @click="select(item)"></c-btn>
          </v-col>
          <!--/v-row-->
        </v-row>


        <!-- TOOLBAR -->
        <v-row class="align-center justify-center mb-5" style="height: 10vh;">
          <v-col :cols="window.width >= window.height ? '8' : '12'">
            <v-btn v-if="Object.keys(answered).length < 4" :disabled="loading || selected.length !== 4" color="success"
              max-height="100px" :variant="(loading || selected.length !== 4) ? 'outlined' : 'elevated'"
              @click="checkAnswers()" block>
              <v-icon icon="mdi-check"></v-icon>Submit
            </v-btn>
            <v-btn v-else color="success" max-height="100px" variant="elevated" @click="shareAnswers()" block>
              <v-icon icon="mdi-share"></v-icon>share
            </v-btn>
          </v-col>
          <v-col>
            <v-btn :disabled="loading" color="warning" @click="shuffle()" block>
              <v-icon icon="mdi-shuffle"></v-icon>
            </v-btn>
          </v-col>
          <v-col>
            <v-btn :disabled="!selected.length" color="red" @click="selected = []"
              :variant="(!selected.length) ? 'outlined' : 'elevated'" block>
              <v-icon icon="mdi-close"></v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </v-row>

    </v-container>


  </div>
</template>

<script>
import axios from 'axios'
import ConnectionsButton from './ConnectionsButton.vue'
import ConnectionsInfo from './ConnectionsInfo.vue'
import ConfettiExplosion from "vue-confetti-explosion";
export default {
  components: {
    cBtn: ConnectionsButton,
    ConfettiExplosion,
    cInfo: ConnectionsInfo
  },
  data() {
    return {
      window: { width: 0, height: 0 },
      connectionData: {},
      grid: [],
      selected: [],
      border: ['green', 'blue', 'yellow', 'purple'],
      answered: {},
      loading: false,
      snackbar: {
        message: '',
        color: 'red'
      },
      showAlert: false,
      triggerConfetti: false,
      tracker: []
    }
  },
  async mounted() {
    var date = this.currentDate;
    var data = (await axios.get(`/api/svc/connections/v1/${date}.json`, {
      crossDomain: true,
      headers: {
        "Content-Type": 'application/json'
      }
    })).data;
    console.log(data)
    this.connectionData = data;
    this.grid = this.connectionData.startingGroups;
  },
  created() {
    window.addEventListener('resize', this.handleResize);
    this.handleResize();
  },
  destroyed() {
    window.removeEventListener('resize', this.handleResize);
  },
  computed: {
    currentDate() {
      var localDate = new Date().toDateString();
      return new Date(localDate).toISOString().split('T')[0];
    },
    buttonSize() {
      var b = {
        width: "100%",
        height: "100%"
      };
      return b;
    },
    flattenedGrid() {
      return this.grid.flat();
    }
  },
  methods: {
    handleResize() {
      this.window.width = window.innerWidth;
      this.window.height = window.innerHeight;
    },
    isSelected(item) {
      return this.selected.includes(item);
    },
    select(item) {
      if (this.isSelected(item)) {
        this.selected = this.selected.filter(e => e !== item);
      } else {
        this.selected.push(item);
      }
    },
    getSelectionColor(item) {
      if (this.isSelected(item)) {
        var selectionIndex = this.selected.indexOf(item);
        if (selectionIndex > 3) {
          return 'red'
        } else {
          return 'primary'
        }
      }
      return ''
    },
    checkAnswers() {
      this.loading = true;
      try {
        var selectionToCheck = this.selected.slice(0, 4);
        this.addToTracker(selectionToCheck);
        var groups = {}
        var closestNumber = 0;
        for (var group in this.connectionData.groups) {
          var numberFoundInGroup = 0;
          for (var index in this.connectionData.groups[group].members) {
            var answer = this.connectionData.groups[group].members[index];
            if (selectionToCheck.includes(answer)) {
              numberFoundInGroup++;
            }
          }
          if (numberFoundInGroup >= 4) {
            this.explode();
            return this.processGroup(group);
          }
          closestNumber = Math.max(closestNumber, numberFoundInGroup);
        }
        this.showAlert = true;
        this.snackbar.message = (4 - closestNumber + ' Away...');
        this.snackbar.color = 'red';
        this.loading = false;
      } catch (e) {
        console.error(e);
        this.loading = false;
      }
    },
    processGroup(group) {
      var newGrid = [...this.flattenedGrid];
      newGrid = newGrid.filter(item => {
        return !this.connectionData.groups[group].members.includes(item);
      });
      if (!this.answered[group]) this.answered[group] = this.connectionData.groups[group].members;
      this.reconstructGrid(newGrid);
    },
    reconstructGrid(newGrid, keepSelection) {
      // bubble up answered levels
      var grid = [];
      var answers = {};
      Object.keys(this.answered).forEach(key => {
        var members = this.answered[key];
        //grid.push([ ...members ])
      });

      while (grid.length < (4 - Object.keys(this.answered).length)) grid.push([])

      // slice in the remaining items
      for (var index in grid) {
        if (grid[index].length == 0) {
          var remainder = newGrid.splice(0, 4);
          grid[index] = remainder;
        }
      }

      this.grid = grid;
      if (!keepSelection) this.selected = [];
      this.loading = false;
    },
    getBorderColor(groupId) {
      var i = this.connectionData.groups[groupId].level;
      return this.border[i];
    },
    shuffle() {
      this.loading = true;
      //reset if done
      if (Object.keys(this.answered).length >= 4) {
        this.answered = {};
        this.grid = this.connectionData.startingGroups;
      }

      try {
        var outputGrid = [...this.flattenedGrid];
        outputGrid.sort(() => Math.random() - 0.5);
        this.reconstructGrid(outputGrid, true);
        this.loading = false;
      } catch (e) {
        console.error(e)
        this.loading = false;
      }
    },
    explode() {
      if (this.triggerConfetti) {
        this.triggerConfetti = false;
      }
      setTimeout(() => {
        this.triggerConfetti = true;
      }, 200)
    },
    addToTracker(guesses) {
      var trackerRow = [];
      var emojiKey = ["&#129001;", "&#129000;", "&#128998;", "&#129002;"];
      guesses.forEach(guess => {
        // look up from master list
        for (var key in this.connectionData.groups) {
          var level = this.connectionData.groups[key].level;
          this.connectionData.groups[key].members.forEach(member => {
            if (member == guess) {
              trackerRow.push(emojiKey[level]);
            }
          });
        }
      });
      this.tracker.push(trackerRow);
    },
    shareAnswers() {
      const element = this.$refs.tracker;
      const title = `Connections\nPuzzle #${this.connectionData.id}\n`;
      const text = element.innerText;
      const html = element.innerHTML;
      try {
        if (navigator.share) {
          navigator.share({ title, text })
            .then(() => console.log('Successful share'))
            .catch(error => console.log('Error sharing:', error));
        } else {
          throw "Share functionality not supported for device; copying to clipboard instead.";
        }
      } catch (e) {
        navigator.clipboard.write([new ClipboardItem({
          'text/plain': new Blob([title + text], { type: 'text/plain' }),
          'text/html': new Blob([html], { type: 'text/html' })
        })])
          .then(() => {
            this.showAlert = true;
            this.snackbar.message = "Copied to Clipboard!";
            this.snackbar.color = "success";
          })
          .catch(error => console.log('Error sharing:', error));
      }
    }
  },
}
</script>

<style>
.tracker-ul {
  height: 0;
  overflow: hidden;
  position: absolute;
  left: 0;
  top: 0;
}
</style>