import { SET_AUDIO_BUFFER, SET_SPECTROGRAM, SWITCH_PAGE } from '../constants/mutation-types';

export default {
  [SET_AUDIO_BUFFER](state, { audioBuffer }) {
    state.sourceAudioBuffer = audioBuffer;
  },
  [SET_SPECTROGRAM](state, { spectrogram }) {
    state.spectrogram = spectrogram;
  },
  [SWITCH_PAGE](state, { page }) {
    state.page = page;
  }
}