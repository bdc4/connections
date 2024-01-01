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
        showHints: true,
        customSettings: false
      }
    }
  },
  mutations: {
    save(state, payload) {
      state[payload.id] = payload.value;
    }
  }
})

const app = createApp(App)

// Install the store instance as a plugin
app.use(store)

registerPlugins(app)

app.mount('#app')
