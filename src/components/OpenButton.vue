<template>
  <div class="open-button">
    <input v-on:change="handleChange" ref="soundfiles" type="file" id="soundupload" accept="audio/*" />
  </div>
</template>

<script>
import { sumToMono, normalize, crop } from '../modules/audioBufferProcess'

export default {
  name: 'OpenButton',
  methods: {
    handleChange: async function () {
      // subfunction
      const loadFileAsArrayBuffer = (f) => {
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.readAsArrayBuffer(f);
          reader.onload = resolve;
        })
      }
      
      // Main
      const context = new AudioContext({latencyHint: 'interactive', sampleRate: 22050});
      const f = this.$refs.soundfiles.files[0];
      const DESIRED_DURATION = 10; //in seconds.
      const loadEvent = await loadFileAsArrayBuffer(f);
      const originalAudioBuffer = await context.decodeAudioData(loadEvent.target.result);
      const monoAudioBuffer = sumToMono(originalAudioBuffer);
      const croppedAudioBuffer = crop(monoAudioBuffer , DESIRED_DURATION);
      const normalizedAudioBuffer = normalize(croppedAudioBuffer);
      this.$emit('set-audio-buffer', normalizedAudioBuffer);
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    canvas {
      background-color: #13161A;
    }
</style>