<template>
  <v-container>
    <!-- input v-on:keyup.enter="explode()" /-->

    <div>
      <ConfettiExplosion v-if="confetti.trigger" :particle-count="50" :colors="confetti.colors" class="img-r-180"
        :stage-height="window.height" :stage-width="window.width * 1.25" :force="1"
        :style="`position: absolute; left: ${confetti.location.x}px; top: ${confetti.location.y}px;`" />
      <v-snackbar v-model="showAlert" location="center" :color="snackbar.color" max-width="80"
        :timeout="snackbar.timeout || 1500" content-class="text-center">
        <span>{{ snackbar.message }}</span>
      </v-snackbar>
    </div>

    <v-container>
      <v-row class="justify-space-between" style="height: 100vh;">
        <!-- HEADER ROW -->
        <v-row>
          <v-col cols="9">
            <div class="d-flex">
              <h3>Connections 2.0</h3>
              <span><c-patch-notes /></span>
            </div>
            <div>{{ this.currentDate }}</div>
          </v-col>
          <v-col class="text-right" cols="3">
            <c-prefs />
            <c-info />
          </v-col>
        </v-row>

        <!-- LOADER ROW -->
        <v-row v-if="!Object.keys(this.connectionData).length" class="w-100 text-center">
          <v-col>
            <h1><v-progress-circular indeterminate></v-progress-circular> Loading...</h1>
          </v-col>
        </v-row>

        <!-- GRID ROW -->
        <v-row class="">
          <v-col cols="12" v-for="answer in Object.keys(answered)" :key="answer" class="pa-0 mb-2" style="height: 15vh;"
            :ref="`answerRef${answer}`">
            <v-btn :height="buttonSize.height" :color="getBorderColor(answer)" block @click="explode(answer)">
              <div>
                <h3 style="white-space: normal;">{{ answer }}</h3>
                <div style="white-space: break-spaces;">{{ answered[answer].join(', ') }}</div>
              </div>
            </v-btn>
          </v-col>
          <v-col cols="3" v-for="item in grid.flat()" :key="item" class="pa-1"
            style="width: 25vw; height: 15vh; max-height: 25vw;">
            <c-btn :size="buttonSize" :text="item" :showHint="hints.includes(item)" :color="getSelectionColor(item)"
              @click="select(item)" :c-data="getGroupInfoFromID(item)"></c-btn>
          </v-col>
        </v-row>


        <!-- TOOLBAR -->
        <v-row class="align-center justify-center mb-5" style="height: 10vh;">
          <template v-if="!gameDone">
            <v-col :cols="'12'">
              <v-btn v-if="!gameDone" :disabled="loading || selected.length !== 4" color="success" max-height="100px"
                :variant="(loading || selected.length !== 4) ? 'outlined' : 'elevated'" @click="checkAnswers()" block>
                <v-icon icon="mdi-check"></v-icon>Submit
              </v-btn>
            </v-col>
            <v-col>
              <v-btn :disabled="loading" color="warning" @click="shuffle()" block>
                <v-icon icon="mdi-shuffle"></v-icon>
              </v-btn>
            </v-col>
            <v-col>
              <c-hint-modal :selected="selected" @check-two="checkTwo" @get-two-random="showHint()"></c-hint-modal>
            </v-col>
            <v-col>
              <v-btn :disabled="!selected.length" color="red" @click="selected = []"
                :variant="(!selected.length) ? 'outlined' : 'elevated'" block>
                <v-icon icon="mdi-close-thick"></v-icon>
              </v-btn>
            </v-col>
          </template>
          <template v-else>
            <v-col cols="12">
              <c-share :puzzle-id="currentDate" :tracker="tracker" :open-on-click="true" share-height="80px"></c-share>
            </v-col>
          </template>
        </v-row>
        <v-row v-if="!$store.state.preferences.unlimitedGuesses && !gameDone" class="text-center">
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
          <c-share :open-on-load="true" :puzzle-id="connectionData.id" :tracker="tracker"
            message="Nice Try..."></c-share>
          <v-btn @click="removeMisses(); gameOver = false;" class="mt-10" variant="flat" color="red"
            block>Continue?</v-btn>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-container>
  <small>{{ appVersion }}</small>
</template>

<script>
import axios from 'axios'
import ConnectionsButton from './ConnectionsButton.vue'
import ConnectionsInfo from './ConnectionsInfo.vue'
import ConfettiExplosion from "vue-confetti-explosion";
import ConnectionsShare from './ConnectionsShare.vue';
import ConnectionsSettings from './ConnectionsSettings.vue';
import ConnectionsTracker from './ConnectionsTracker.vue';
import ConnectionsPatchNotes from './ConnectionsPatchNotes.vue';
import ConnectionsDefine from './ConnectionsDefine.vue';
import ConnectionsFieldGoal from './ConnectionsFieldGoal.vue';
import ConnectionsHintsModal from './ConnectionsHintsModal.vue';

export default {

  components: {
    cBtn: ConnectionsButton,
    ConfettiExplosion,
    cInfo: ConnectionsInfo,
    cShare: ConnectionsShare,
    cPrefs: ConnectionsSettings,
    cTracker: ConnectionsTracker,
    cPatchNotes: ConnectionsPatchNotes,
    cDefine: ConnectionsDefine,
    cFieldGoal: ConnectionsFieldGoal,
    cHintModal: ConnectionsHintsModal
  },
  data() {
    return {
      window: { width: 0, height: 0 },
      connectionData: {},
      confetti: {
        location: {
          x: window.innerWidth / 2, y: window.innerHeight / 3
        },
        trigger: false,
        colors: undefined
      },
      grid: [],
      selected: [],
      borderRGBColors: [
        [255, 235, 59],
        [76, 175, 80],
        [33, 150, 243],
        [156, 39, 176]
      ],
      border: ['rgb(255, 235, 59)', 'rgb(76, 175, 80)', 'rgb(33, 150, 243)', 'rgb(156, 39, 176)'],
      answered: {},
      answerRefs: [],
      loading: false,
      snackbar: {
        message: '',
        color: 'red'
      },
      showAlert: false,
      tracker: [],
      hints: [],
      hintUsed: false,
      misses: 0,
      gameOver: false,
      gameStateKeys: ['grid', 'hints', 'misses', 'tracker', 'answered', 'showHint']
    }
  },
  async mounted() {

    // Pull main data from browser cache or api
    await this.httpData();
    this.connectionData = this.$store.state.cachedConnectionsData.find(cacheItem => {
      return cacheItem[this.currentDate];
    })[this.currentDate];
    this.grid = this.connectionData.startingGroups;

    // Load Game State from memory
    const gameState = this.$store.state.game[this.currentDate] || {};
    this.gameStateKeys.forEach(key => {
      this[key] = gameState[key] || this[key];
    });

  },
  async created() {
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
    appVersion() {
      return __APP_VERSION__;
    },
    gameState() {
      var str = '';
      this.gameStateKeys.forEach(key => {
        str += JSON.stringify(this[key]) + '|'
      })
      return str;
    },
    currentDate() {
      var localDate = new Date().toDateString();
      return this.$route.params.date || (this.transformDate(localDate));
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
    },
    confettiColors() {
      return this.getConfettiColors(Object.keys(this.answered)[Object.keys(this.answered).length - 1]);
    },
    gameDone() {
      return Object.keys(this.answered).length >= 4
    }
  },
  methods: {
    async httpData(dateString) {

      dateString = dateString || this.currentDate;
      var data;

      console.log(`Attempting to retrieve from cache with key ${dateString}...`)

      // Check cache, then try API
      try {
        var existingIndex = this.$store.state.cachedConnectionsData.findIndex(cacheItem => {
          return (cacheItem[dateString])
        });
        if (existingIndex === -1) {
          console.log(`Connection Data for ${dateString} not found in local storage. Pulling from server.`)
          throw 'error';
        }

        data = this.$store.state.cachedConnectionsData[existingIndex][dateString];
        data._fromCache = true;
        console.log(`Cache Grab successful for key ${dateString}. Found at index ${existingIndex}.`);
      } catch (e) {
        try {

          await fetch(`../../json/${dateString}.json`).then(response =>
            response.json().then(data => ({
              data: data,
              status: response.status
            })
            ).then(res => {
              console.log(res.status, res.data);
              this.cacheConnectionsData(dateString, res.data);
            }))
            .catch(err => {
              console.error(`Error retrieving data from local JSON file: ${err}`);
              throw err;
            });


        } catch (f) {
          console.error(`Unable to retrieve data and commit to cache. Key: ${dateString}`, data);
          console.error(f);
        }
      }
      return data;
    },
    cacheConnectionsData(dateString, data) {
      data = data && (data.data || data);
      data._cacheTime = new Date(dateString).getTime();
      this.$store.commit('cacheDataResponse', {
        [dateString]: data
      });
    },

    async callApi(dateString) {
      var isDev = window.location.href.includes('localhost');

      // TODO: Move this proxy to a dedicated webserver?
      var url = (isDev) ? `/api/svc/connections/v1/${dateString}.json` : `https://root-lean-galleon.glitch.me/api?date=${dateString}`;
      return axios({
        method: "GET",
        url,
        data: { dateString },
        crossDomain: true,
        headers: {
          "Content-Type": 'application/json'
        }
      });
    },
    transformDate(dateString) {
      const d = new Date(dateString).toISOString().split('T')[0];
      return d;
    },
    getCategoryInfo() {
      const key = Object.keys(this.answered)[Object.keys(this.answered).length - 1];
      const refString = key && `answerRef${key}`; //.replace(' ','')
      const location = this.$refs[refString]; //key && this.$refs[refString];
      const output = {
        key,
        value: { ...this.answered[key] },
        location
      }
      return output
    },
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
        if (selectionIndex <= 3) {
          return '#2471a3'
        }
        else if (selectionIndex > 11) {
          return '#ff5733'
        }
        else if (selectionIndex > 7) {
          return 'brown'
        }
        else if (selectionIndex > 3) {
          return '#DAF7A6'
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
            this.processGroup(group);
            this.explode(group);
            return;
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
      if (!groupId) return;
      var i = this.connectionData.groups[groupId].level;
      const rgb = this.borderRGBColors[i];
      const rgbString = this.getRGBString(rgb);
      return rgbString;
    },
    getConfettiColors(groupId) {
      if (!groupId) return;
      var i = this.connectionData.groups[groupId].level;
      const rgb = this.borderRGBColors[i];
      const rootColor = this.getRGBString(rgb);
      var colors = [rootColor];

      // "shake" the main color
      const shakeStrength = 90;
      [...Array(5)].forEach((_, i) => {
        var newColors = [];
        rgb.forEach(color => {
          var modifier = (Math.random() - .5);
          var newColor = Math.floor(color + (modifier * shakeStrength));
          color = color < 255 ? Math.max(0, newColor) : Math.min(newColor, 255);
          newColors.push(newColor);
        });
        colors.push(this.getRGBString(newColors));
      });
      return colors;
    },
    getRGBString(rgb) {
      return `rgb(${rgb[0]},${rgb[1]},${rgb[2]})`;
    },
    shuffle() {
      this.loading = true;

      //reset if done
      if (this.gameDone) {
        this.answered = {};
        this.grid = this.connectionData.startingGroups;
      }

      // Generate random grid

      try {
        var outputGrid = [...this.flattenedGrid.filter(item => !this.selected.includes(item))];
        outputGrid.sort(() => Math.random() - 0.5);
        var _selectedItems = this.selected.slice();
        console.log(this.selected, _selectedItems);
        outputGrid = outputGrid.concat(_selectedItems.reverse());
        this.reconstructGrid(outputGrid, true);
        this.loading = false;
      } catch (e) {
        console.error(e)
        this.loading = false;
      }
    },
    explode(groupID) {
      if (this.confetti.trigger) {
        this.confetti.trigger = false;
      }
      setTimeout(() => {
        if (groupID) {
          var ref = this.$refs && this.$refs[`answerRef${groupID}`][0].$el.getBoundingClientRect();
          const xMid = ref.x + (ref.width / 2);
          const yMid = ref.y + (ref.height / 2);
          this.confetti.colors = !this.gameDone ? this.getConfettiColors(groupID) : this.border;
          //this.getGroupInfoFromID(groupID).location;
          this.confetti.location.x = xMid;
          this.confetti.location.y = yMid;
        }
        this.confetti.trigger = true;
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

      if (this.hintUsed) {
        trackerRow.push('🤡');
        this.hintUsed = false;
      } else {
        var isPerfectlyCorrect = true;
        [0, 1, 2, 3].forEach(i => {
          isPerfectlyCorrect = isPerfectlyCorrect && trackerRow[i] == '🟪';
        });
        if (isPerfectlyCorrect && !this.tracker.length) {
          trackerRow.push('🤯');
        }
      }

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
    checkTwo(data) {
      var w1 = this.getGroupInfoFromID(data.wordOne);
      var w2 = this.getGroupInfoFromID(data.wordTwo);
      this.hintUsed = true;
      if (w1.level === w2.level) {
        this.hints.push(w1.id, w2.id);
        this.snackbar.message = "It's a match! 🎉";
        this.showAlert = true;
        this.snackbar.timeout = 2000;
        this.snackbar.color = 'green';
      }
      else {
        var e = ["No Dice! 🎲", "Nuh uh 😏", "Nice try! But no... ⭐️", "Better luck next time! 🍀", "Really?? You thought those went together?!? 🙄",
          "Try Harder 💪", "Nope! 😂", "Negative Rampart ✈️"];
        e = this.getRandomFromArray(e);
        this.snackbar.message = e;
        this.showAlert = true;
        this.snackbar.timeout = 2000;
        this.snackbar.color = 'red';
      }
    },
    showHint() {
      // get a random unanswered member
      var g = [...this.grid.flat()];

      var lowestValidGroup;
      var groups = [[], [], [], []];

      g.filter(member => {
        if (!this.hints.includes(member)) {
          var data = this.getGroupInfoFromID(member);
          groups[data.level].push(data);
        }
      });

      groups.forEach(group => {
        if (!lowestValidGroup && group.length) {
          lowestValidGroup = group;
        }
      });

      if (!lowestValidGroup) return;

      this.hintUsed = true;
      var randomMember;

      randomMember = this.getRandomFromArray(lowestValidGroup);
      if (lowestValidGroup.length <= 2) {
        this.hints.push(randomMember.id);
        return;
      }

      var relatedMember = randomMember;

      // Make sure the related member isn't the same member
      while (relatedMember.id == randomMember.id) {
        relatedMember = this.getRandomFromArray(lowestValidGroup);
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

<style scoped>
.img-r-90 {
  transform: rotate(90deg);
}

.img-r-180 {
  transform: rotate(180deg);
}

.img-r-270 {
  transform: rotate(270deg);
}
</style>