import { SET_AUDIO_BUFFER, SET_SPECTROGRAM } from '../constants/mutation-types';
import eventHub from '../utils/eventHub';
import { RENDER_VIEWER } from '../constants/events';

export default {
  [SET_AUDIO_BUFFER](state, { audioBuffer }) {
    state.sourceAudioBuffer = audioBuffer;
    eventHub.$emit(RENDER_VIEWER);
  },
  [SET_SPECTROGRAM](state, { spectrogram }) {
    state.spectrogram = spectrogram;
  }
}