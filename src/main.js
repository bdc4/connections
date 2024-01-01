/**
 * main.js
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Plugins
import { registerPlugins } from '@/plugins'

// Components
import App from './App.vue'

// Composables
import { createApp } from 'vue'
import { createStore } from 'vuex'
import createPersistedState from 'vuex-persistedstate'

// Create a new store instance.
const store = createStore({
  plugins: [createPersistedState({
    storage: window.localStorage,
  })],
  state() {
    return {
      preferences: {
        difficulty: 1,
        showHints: false,
        customSettings: false,
        unlimitedGuesses: false,
        showAwayMessages: true
      },
      game: {}
    }
  },
  mutations: {
    save(state, payload) {
      state[payload.id] = payload.value;
    },
    saveGameState(state, payload) {
      Object.keys(payload).forEach(key => {
        state.game[key] = payload[key];
      })
    }
  }
})

const app = createApp(App)

// Install the store instance as a plugin
app.use(store)

registerPlugins(app)

app.mount('#app')
