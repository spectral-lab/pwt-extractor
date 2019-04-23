import pages from '../constants/pages';
import { SET_AUDIO_BUFFER, SWITCH_PAGE } from '../constants/mutation-types';

const acceptAudio = ({ commit }, { payload }) => {
  const { audioBuffer } = payload;
 commit({
    type: SET_AUDIO_BUFFER,
    audioBuffer
  });
  commit({
    type: SWITCH_PAGE,
    page: pages.VIEWER
  })
}

export default {
  acceptAudio
}