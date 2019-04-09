<template>
  <div class="open-button">
    <input v-on:change="handleChange" ref="soundfiles" type="file" id="soundupload" accept="audio/*" />
    <div>
      <canvas ref="waveform" width="800" height="300">waveform</canvas>
      <canvas ref="spectrogram" width="800" height="300">spectrogram</canvas>
    </div>
  </div>
</template>

<script>
import { sumToMono, normalize, crop, resample } from '../modules/audioBufferProcess'
import { waveform, spectrogram } from '../modules/plot'

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
      const windowSize = 1987;
      const context = new AudioContext({latencyHint: 'interactive', sampleRate: 22050});
      const f = this.$refs.soundfiles.files[0];
      const DESIRED_DURATION = 10; //in seconds.
      const DESIRED_SAMPLE_RATE = 22050;
      const loadEvent = await loadFileAsArrayBuffer(f);
      const originalAudioBuffer = await context.decodeAudioData(loadEvent.target.result);
      const monoAudioBuffer = sumToMono(originalAudioBuffer);
      const croppedAudioBuffer = crop(monoAudioBuffer , DESIRED_DURATION);
      const normalizedAudioBuffer = normalize(croppedAudioBuffer);
      this.$emit('audio-is-ready', normalizedAudioBuffer);
      const resampleEvent = await resample(normalizedAudioBuffer, DESIRED_SAMPLE_RATE);
      const resampledAudioBuffer = resampleEvent.renderedBuffer;
      waveform(resampledAudioBuffer, this.$refs.waveform);
      const resultOfSTFT = await spectrogram(resampledAudioBuffer, this.$refs.spectrogram, windowSize, DESIRED_SAMPLE_RATE);
      this.$emit('stft-completed', resultOfSTFT);
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