<template>
  <div class=viewer>
      <canvas ref="waveform" width="800" height="300">waveform</canvas>
      <canvas ref="spectrogram" width="800" height="300">spectrogram</canvas>
      <canvas ref="peakLines" width="800" height="300">spectrogram</canvas>
    </div>
</template>

<script>
import { resample } from '../utils/audio'
import { PeakLine } from '../classes' // eslint-disable-line no-unused-vars
import { renderWaveform, renderSpectrogram } from '../utils/plot'
import { RENDER_VIEWER, RENDER_PEAK_LINES } from '../constants/events';
import { SET_SPECTROGRAM } from '../constants/mutation-types';

export default {
  created() {
    this.$eventHub.$on(RENDER_VIEWER, this.plotWaveformAndSpectrogram);
    this.$eventHub.$on(RENDER_PEAK_LINES, this.plotPeakLines);
  },
  methods: {
    async plotWaveformAndSpectrogram() {
      const audioBuffer = this.$store.state.sourceAudioBuffer;
      const DESIRED_SAMPLE_RATE = 22050;
      const windowSize = 1987;
      const resampleEvent = await resample(audioBuffer, DESIRED_SAMPLE_RATE);
      const resampledAudioBuffer = resampleEvent.renderedBuffer;
      renderWaveform(resampledAudioBuffer, this.$refs.waveform);
      const spectrogram = await renderSpectrogram(resampledAudioBuffer, this.$refs.spectrogram, windowSize, DESIRED_SAMPLE_RATE);
      this.$store.commit({
        type: SET_SPECTROGRAM,
        spectrogram
      });
    },
    /** @param {Array.<PeakLine>} peakLines */
    plotPeakLines(peakLines) {
      // Work In Progress
      console.log(peakLines)
      console.log("Partial Viwer is under construction");
    }
  }
}
</script>

<style scoped>
  canvas {
    background-color: #13161A;
  }
</style>