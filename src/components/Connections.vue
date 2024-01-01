<template>
  <div>
    <template v-if="!Object.keys(this.connectionData).length">
      <h1>Loading...</h1>
    </template>

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
            <c-prefs />
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
            <c-btn :size="buttonSize" :text="item" :showHint="hints.includes(item)" :color="getSelectionColor(item)"
              @click="select(item)" :c-data="getGroupInfoFromID(item)"></c-btn>
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
            <c-share v-else :puzzle-id="connectionData.id" :tracker="tracker" :open-on-click="true"></c-share>
          </v-col>
          <v-col>
            <v-btn :disabled="loading" color="warning" @click="shuffle()" block>
              <v-icon icon="mdi-shuffle"></v-icon>
            </v-btn>
          </v-col>
          <v-col v-if="$store.state.preferences.showHints">
            <v-btn :disabled="loading || hints.length > (grid.flat().length - 2)" color="info" @click="showHint()" block>
              <v-icon icon="mdi-help-circle-outline"></v-icon>Show Hint
            </v-btn>
          </v-col>
          <v-col>
            <v-btn :disabled="!selected.length" color="red" @click="selected = []"
              :variant="(!selected.length) ? 'outlined' : 'elevated'" block>
              <v-icon icon="mdi-close-thick"></v-icon>
            </v-btn>
          </v-col>
        </v-row>
        <v-row v-if="!$store.state.preferences.unlimitedGuesses" class="text-center">
          <v-col v-for="(miss, ind) in [0, 1, 2, 3]" :key="ind">
            <v-icon :icon="`mdi-close-${(ind < misses) ? 'thick' : 'outline'}`" size="x-large"
              :color="`${(ind < misses) ? 'red' : ''}`"></v-icon>
          </v-col>
        </v-row>
      </v-row>
    </v-container>

    <!-- GAME OVER -->
    <v-dialog v-model="gameOver" persistent>
      <v-card>
        <v-card-text>
          <c-share :open-on-load="true" :puzzle-id="connectionData.id" :tracker="tracker" message="Nice Try..."></c-share>
          <v-btn @click="removeMisses(); gameOver = false;" class="mt-10" variant="flat" color="red"
            block>Continue?</v-btn>
        </v-card-text>
      </v-card>

    </v-dialog>

  </div>
</template>

<script>
import axios from 'axios'
import ConnectionsButton from './ConnectionsButton.vue'
import ConnectionsInfo from './ConnectionsInfo.vue'
import ConfettiExplosion from "vue-confetti-explosion";
import ConnectionsShare from './ConnectionsShare.vue';
import ConnectionsSettings from './ConnectionsSettings.vue';
import ConnectionsTracker from './ConnectionsTracker.vue';

export default {

  components: {
    cBtn: ConnectionsButton,
    ConfettiExplosion,
    cInfo: ConnectionsInfo,
    cShare: ConnectionsShare,
    cPrefs: ConnectionsSettings,
    cTracker: ConnectionsTracker
  },
  data() {
    return {
      window: { width: 0, height: 0 },
      connectionData: {},
      grid: [],
      selected: [],
      border: ['yellow', 'green', 'blue', 'purple'],
      answered: {},
      loading: false,
      snackbar: {
        message: '',
        color: 'red'
      },
      showAlert: false,
      triggerConfetti: false,
      tracker: [],
      hints: [],
      misses: 0,
      gameOver: false,
      gameStateKeys: ['grid','hints','misses','tracker','answered']
    }
  },
  async mounted() {

    var date = this.currentDate;
    // TODO: Move this proxy to a dedicated webserver
    var isDev = window.location.href.includes('localhost');
    var url = isDev ? `/api/svc/connections/v1/${date}.json` : `https://root-lean-galleon.glitch.me/api?date=${this.currentDate}`
    var data = (await axios({
      method: "GET",
      url,
      crossDomain: true,
      headers: {
        "Content-Type": 'application/json'
      }
    })).data;

    this.connectionData = data;
    this.grid = this.connectionData.startingGroups;

    // Load Game State from memory
    const gameState = this.$store.state.game[date];
    this.gameStateKeys.forEach(key => {
      this[key] = gameState[key] || this[key];
    });
  },
  created() {
    window.addEventListener('resize', this.handleResize);
    this.handleResize();
  },
  destroyed() {
    window.removeEventListener('resize', this.handleResize);
  },
  watch: {
    'gameState': {
      handler: function (newVal, oldVal) {
        const payload = {}
        this.gameStateKeys.forEach(key => {
          payload[key] = this[key];
        });
        this.$store.commit('saveGameState', {
          [this.currentDate]: payload
        });
      }
    },
    'gameOver': {
      handler: function (newVal, oldVal) {
        if (newVal == true) {
          this.tracker.push(['❌', '❌', '❌', '❌'])
        }
      }
    }
  },
  computed: {
    gameState () {
      var str = '';
      this.gameStateKeys.forEach(key => {
        str += JSON.stringify(this[key]) + '|'
      })
      return str;
    },
    currentDate() {
      var localDate = new Date().toDateString();
      return this.$route.params.date || (new Date(localDate).toISOString().split('T')[0]);
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
        this.snackbar.message = this.$store.state.preferences.showAwayMessages ?
          (4 - closestNumber + ' Away...') : 'Incorrect...';
        this.snackbar.color = 'red';

        this.misses++;

        if (this.misses >= 4 && !this.$store.state.preferences.unlimitedGuesses) {
          this.gameOver = true;
        }

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

      // Generate random grid
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
      var emojiKey = ['🟨', '🟩', '🟦', '🟪'];
      guesses.forEach(guess => {
        // look up from master list
        var groupData = this.getGroupInfoFromID(guess);
        trackerRow.push(emojiKey[groupData.level]);
      });
      this.tracker.push(trackerRow);
    },
    getGroupInfoFromID(id) {
      for (var key in this.connectionData.groups) {
        var level = this.connectionData.groups[key].level;
        var members = this.connectionData.groups[key].members;
        var data;
        members.forEach(member => {
          if (member == id) {
            data = { id, level, members, color: this.border[level] };
          }
        });
        if (data)
          return data;
      }
    },
    showHint() {
      // get a random unanswered member
      var g = [...this.grid.flat()];
      var randomMember;

      do {
        randomMember = this.getRandomFromArray(g);
      } while (this.hints.includes(randomMember));

      randomMember = this.getGroupInfoFromID(randomMember);
      var relatedMember = randomMember;

      // Make sure the related member isn't the same member
      while (relatedMember.id == randomMember.id) {
        relatedMember = this.getRandomFromArray(randomMember.members);
        relatedMember = this.getGroupInfoFromID(relatedMember);
      }

      // add their keys to the hint array
      this.hints.push(randomMember.id, relatedMember.id);
    },
    getRandomFromArray(g) {
      return g[Math.floor(Math.random() * g.length)];
    },
    removeMisses() {
      if (this.misses > 0) {
        this.misses--;
        setTimeout(this.removeMisses, 150);
      }
    }
  }
}
</script>

<style></style>