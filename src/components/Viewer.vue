<template>
  <div class=viewer>
      <canvas ref="waveform" width="800" height="300">waveform</canvas>
      <canvas ref="spectrogram" width="800" height="300">spectrogram</canvas>
    </div>
</template>

<script>
import { resample } from '../modules/audioBufferProcess'
import { waveform, spectrogram } from '../modules/plot'

export default {
  name: 'Viewer',
  props: {
    sourceAudioBuffer: AudioBuffer
  },
  created() {
    this.$eventHub.$on('audio-is-ready', this.plot);
  },
  methods: {
    plot: async function (audioBuffer) {
      const DESIRED_SAMPLE_RATE = 22050;
      const windowSize = 1987;
      const resampleEvent = await resample(audioBuffer, DESIRED_SAMPLE_RATE);
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