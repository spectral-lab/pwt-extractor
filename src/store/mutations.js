import { SET_AUDIO_BUFFER, SET_SPECTROGRAM, PUSH_SCREEN } from '../constants/mutation-types';

export default {
  [SET_AUDIO_BUFFER](state, { audioBuffer }) {
    state.sourceAudioBuffer = audioBuffer;
  },
  [SET_SPECTROGRAM](state, { spectrogram }) {
    state.spectrogram = spectrogram;
  },
  [PUSH_SCREEN](state, { screen }) {
    state.screen = screen;
  }
}