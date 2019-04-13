<template>
  <div class="open-button">
    <input @change="handleChange" ref="soundfiles" type="file" id="soundupload" accept="audio/*" />
  </div>
</template>

<script>
import { sumToMono, normalize, crop } from '../utils/audio'
import { SET_AUDIO_BUFFER } from '../constants/mutation-types';
import loadFileAsArrayBuffer from '../utils/helpers/loadFileAsArrayBuffer';

export default {
  name: 'OpenButton',
  methods: {
    handleChange: async function () {
      const context = new AudioContext({latencyHint: 'interactive', sampleRate: 22050});
      const f = this.$refs.soundfiles.files[0];
      const DESIRED_DURATION = 10; //in seconds.
      const loadEvent = await loadFileAsArrayBuffer(f);
      const originalAudioBuffer = await context.decodeAudioData(loadEvent.target.result);
      const monoAudioBuffer = sumToMono(originalAudioBuffer);
      const croppedAudioBuffer = crop(monoAudioBuffer , DESIRED_DURATION);
      const normalizedAudioBuffer = normalize(croppedAudioBuffer);
      this.$store.commit({
        type: SET_AUDIO_BUFFER,
        audioBuffer: normalizedAudioBuffer
      });
    }
  }
}
</script>

<style scoped>
    canvas {
      background-color: #13161A;
    }
</style>