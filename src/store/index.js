import Vue from 'vue';
import Vuex from 'vuex';
import mutations from './mutations';
import screens from '../constants/screens';

Vue.use(Vuex);
const store = new Vuex.Store({
  state: {
    screen: screens.OPEN_FILE,
    sourceAudioBuffer: new AudioBuffer({
      length: 1, 
      numberOfChannels: 1, 
      sampleRate: 22050
    }),
    spectrogram: {
      times: [],
      freqs: [],
      magnitude2d: []
    }
  },
  mutations
})

export default store;