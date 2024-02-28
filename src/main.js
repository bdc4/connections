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
      CACHE_LIMIT: 5,
      preferences: {
        difficulty: 0,
        showHints: true,
        customSettings: false,
        unlimitedGuesses: true,
        showAwayMessages: true
      },
      game: {},
      cachedConnectionsData: []
    }
  },
  mutations: {
    cacheDataResponse(state, response) {

      // Update Cache if data exists at the cache key, otherwise add to cache.
      /*
      if (existingIndex !== -1) {
        console.log(`exists at value ${existingIndex}`, state.cachedConnectionsData[existingIndex]);
        state.cachedConnectionsData[existingIndex] = response;
      } else {
        state.cachedConnectionsData.push(response);
      }
      */

      state.cachedConnectionsData.push(response);
      // Prune the oldest item from the cache when the limit is exceeded
      if (state.cachedConnectionsData.length > state.CACHE_LIMIT) {
        var oldestIndex;
        state.cachedConnectionsData.forEach((item, index, arr) => {
          var ct = item[Object.keys(item)[0]]._cacheTime;
          if (oldestIndex === undefined || ct < arr[oldestIndex]._cacheTime) {
            oldestIndex = index;
          }
        });
        if(oldestIndex >= 0) {
          state.cachedConnectionsData.splice(oldestIndex, 1);
        }
      }
    },
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
