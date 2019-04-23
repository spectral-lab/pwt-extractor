import Vue from 'vue';
import Vuex from 'vuex';
import mutations from './mutations';
import actions from './actions';
import pages from '../constants/pages';

Vue.use(Vuex);
const store = new Vuex.Store({
  state: {
    page: pages.OPEN_FILE,
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
  mutations,
  actions
})

export default store;