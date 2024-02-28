<template>
  <v-btn block color="info">
    <v-icon>mdi-football</v-icon>
    <v-dialog activator="parent" v-model="open">
      <div class="test">
      </div>
      <v-card>
        <v-card-title>
          Go for the extra point!
        </v-card-title>
        <v-card-text>
          Can you guess the last category? Type a word below. If the category contains that word, you win! (Capitalization
          doesn't matter.)
          <v-text-field v-model="input" @keydown.space.prevent></v-text-field>
          {{ capitalInput }}: {{ keywords }}
          <pre class="d-flex flex-column text-center py-10 align-center" style="line-height: 16px;">
            <div class="d-flex text-center align-center justify-center">
              <ConfettiExplosion v-if="football.done && football.good" :particle-count="50" :force="1"/>
            </div>

            <img ref="fieldGoalRef" src="../assets/fieldgoal.svg" style="width: 50%; filter: invert(98%) sepia(16%) saturate(7286%) hue-rotate(349deg) brightness(98%) contrast(105%);"/>
           </pre>
        </v-card-text>
        <v-card-actions class="justify-center">
          <v-btn :color="'primary'" @click="football.done ? (open = false) : football.animate ? null : checkIfGood()"
            size="x-large" flat>
            <template v-slot:prepend>
              <div>
                <div class="d-flex align-center justify-center">
                  <v-icon :class="{ [football.class]: (football.animate || football.done) }" size="x-large"
                    style="rotate: -45deg;">mdi-football</v-icon>
                </div>
              </div>
            </template>
            <template v-slot:default>
              {{ football.done ? (football.good ? 'It\'s Good!!' : 'Nice Try') : 'Kick!' }}
            </template>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-btn>
</template>

<script setup>
import { ref, computed } from 'vue';
import ConfettiExplosion from "vue-confetti-explosion";

var open = ref(false);
var fieldGoalRef = ref({ x: 0, y: 0 });

var fgr = ref({ x: 0, y: 0 })
var fgrComp = computed(() => {
  try {
    const el = fieldGoalRef.value;
    console.log(el.offsetLeft, el.offsetTop, el.width)
    console.dir(el);

    var centerX = (el.offsetLeft + el.width/2);
    var centerY = (el.offsetTop + 147/2);

    fgr.value.x = centerX+'px';
    fgr.value.y = centerY+'px';

    return {
      x: centerX+'px',
      y: centerY+'px'
    }
  } catch (e) {
    debugger;
    console.log('fieldGoalRef error', e)
    return { x: 0, y: 0 }
  }

})

const props = defineProps({
  answer: {
    type: String,
    default: 'BRYCE IS COOL'
  }
});

var football = ref({
  class: '',
  color: 'success', //'#825736'
  good: false,
  animate: false,
  done: false
});

var input = ref('');
var capitalInput = computed(() => input.value && input.value.replace(' ', '').toUpperCase());
var keywords = ref(props.answer.split(' ') || []);

var btn = computed(() => {
  return {
    text: 'Kick!',
    color: 'success'
    //text: (!football.value.done && !football.value.animate) ? 'Kick!' : (football.value.good && football.value.done) ? 'Nice Work!' : 'Nice Try!',
    //color: (!football.value.done && !football.value.animate) ? 'success' : (football.value.good && football.value.done) ? 'success' : 'red'
  }
});

const checkIfGood = function () {

  football.value.animate = true;
  football.value.done = false;
  football.value.good = !!(capitalInput.value && keywords.value.includes(capitalInput.value));

  const randSlice = Math.round(Math.random()) ? 'ball-r' : 'ball-l';
  football.value.class = 'ball ' + (football.value.good ? '' : randSlice);
  setTimeout(() => {
    football.value.done = true;
    football.value.animate = false;
  }, 2000);
}

</script>

<style scoped>
.test {
  position: absolute;
  left: v-bind('fgr.value && fgr.value.x');
  top: v-bind('fgr.value && fgr.value.y');
  width: 100px;
  height: 100px;
  z-index: 100;
  background-color: red;
}
.ball {
  animation: x-motion 3s ease-out 0s;
  position: absolute;
  animation-fill-mode: forwards;

}

.ball-r {
  animation: x-motion-r 3s ease-out 0s;
  animation-fill-mode: forwards;

}

.ball-l {
  animation: x-motion-l 3s ease-out 0s;
  animation-fill-mode: forwards;
}

.ball:before {
  animation: y-motion 3s ease-out 0s;
  position: absolute;
  animation-fill-mode: forwards;
}

@keyframes x-motion {
  0% {
    left: 0;
  }

  100% {
    left: v-bind('fgr.x')
  }
}

@keyframes x-motion-l {
  0% {
    left: 0;
  }

  50% {
    left: v-bind('fgr.x');
  }

  100% {
    left: v-bind('fgr.x');
  }
}

@keyframes x-motion-r {
  0% {
    right: 0;
  }

  50% {
    right: v-bind('fgr.x');
  }

  100% {
    right: calc(v-bind('fgr.x') - 12px - 120px);
  }
}

@keyframes y-motion {
  0% {
    top: 0;
    transform: rotateZ(0);
  }

  100% {
    top: v-bind('fgr.y');
    transform: rotateZ(calc(360deg * 6))
  }
}
</style>