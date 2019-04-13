import screens from '../constants/screens';
import { SET_AUDIO_BUFFER, PUSH_SCREEN } from '../constants/mutation-types';

const acceptAudio = ({ commit }, audioBuffer) => {
  commit({
    type: SET_AUDIO_BUFFER,
    audioBuffer
  });
  commit({
    type: PUSH_SCREEN,
    screen: screens.VIEWER
  })
}

export default {
  acceptAudio
}