<template>
  <div class="open-button">
    <input v-on:change="handleChange" ref="soundfiles" type="file" id="soundupload" accept="audio/*" />
    <div ref="waveform">
      <canvas ref="waveformCanvas" width="800" height="300">current stock price: $3.15 + 0.15</canvas>
    </div>
  </div>
</template>

<script>
import { sumToMono, normalize, crop, resample } from '../modules/audioBufferProcess'
import { waveform } from '../modules/plot'

export default {
  name: 'openButton',
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
      const context = new AudioContext({latencyHint: 'interactive', sampleRate: 20500});
      const f = this.$refs.soundfiles.files[0];
      const DESIRED_DURATION = 10; //in seconds.
      const DESIRED_SAMPLE_RATE = 22050;
      const loadEvent = await loadFileAsArrayBuffer(f);
      const originalAudioBuffer = await context.decodeAudioData(loadEvent.target.result)
      const monoAudioBuffer = sumToMono(originalAudioBuffer);
      const croppedAudioBuffer = crop(monoAudioBuffer , DESIRED_DURATION);
      const normalizedAudioBuffer = normalize(croppedAudioBuffer);
      const resampleEvent = await resample(normalizedAudioBuffer, DESIRED_SAMPLE_RATE);
      const resampledAudioBuffer = resampleEvent.renderedBuffer;
      waveform(resampledAudioBuffer, this.$refs.waveformCanvas);
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