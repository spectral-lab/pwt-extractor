<template>
  <div id="container">
    <div id="viewerArea">
      <div class="viewer-child-container waveform">
        <canvas id="waveform" ref="waveform" />
      </div>
      <div class="viewer-child-container spectrogram">
        <canvas id="spectrogram" ref="spectrogram" />
      </div>
      <div class="viewer-child-container spectrogram">
        <canvas id="peakLines" ref="peakLines" />
      </div>
    </div>
    <play-button />
    <mock-post-button />
  </div>
</template>

<script>
import PlayButton from './PlayButton.vue';
import MockPostButton from './MockPostButton.vue';
import { resample } from '../utils/audio'
import { PeakLine } from '../classes' // eslint-disable-line no-unused-vars
import { renderWaveform, renderSpectrogram } from '../utils/plot'
import { SET_SPECTROGRAM } from '../constants/mutation-types';

export default {
  mounted() {
    this.plotWaveformAndSpectrogram();
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
  },
  components:{
    PlayButton,
    MockPostButton
  }
}
</script>

<style scoped>
  #container {
    height: 100vh;
  }
  #viewerArea {
   position: relative;
   margin: 0 auto;
   width: 60%;
   height: 300px;
  }
 .viewer-child-container {
   position: absolute;
   top: 0;
   left: 0;
   width: 100%;
   height: 100%;
   /* margin: 0 auto; */
 }
 .viewer-child-container canvas {
   width: 100%;
   height: 100%;
 }
</style>