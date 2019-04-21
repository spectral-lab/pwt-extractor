<template>
  <div id="container">
    <mock-post-button />
    <div id="viewerArea">
      <div class="viewer-child-container spectrogram" :style="spectrogram">
        <canvas id="spectrogram" ref="spectrogram" />
      </div>
      <div id="peakLinesContainer" class="viewer-child-container spectrogram" :style="spectrogram">
        <canvas id="peakLines" ref="peakLines" />
      </div>
      <div class="viewer-child-container waveform" :style="waveform">
        <canvas id="waveform" ref="waveform" />
      </div>
    </div>
    <div id="utilities">
      <play-button />
      <slider v-model="viewerOpacity" />
    </div>
  </div>
</template>

<script>
import PlayButton from './PlayButton.vue';
import MockPostButton from './MockPostButton.vue';
import Slider from './Slider.vue'
import { resample } from '../utils/audio'
import { PeakLine } from '../classes' // eslint-disable-line no-unused-vars
import { renderWaveform, renderSpectrogram, renderPeakLines } from '../utils/plot'
import { SET_SPECTROGRAM } from '../constants/mutation-types';
import { RENDER_PEAK_LINES } from '../constants/events';

const fadedOpacity = value => value >= 0.5 ? 1.0 : value * 2.0

export default {
  data(){
    return {
      viewerOpacity: 50,
    }
  },
  computed:{
    waveform(){
      const value = Number(this.viewerOpacity) / 100;
      return {
        opacity: fadedOpacity(value)
      };
    },
    spectrogram(){
      const value = Math.abs(1.0 - (Number(this.viewerOpacity) / 100));
      return {
        opacity: fadedOpacity(value)
      };
    }
  },
  mounted() {
    this.plotWaveformAndSpectrogram();
    this.$eventHub.$on(RENDER_PEAK_LINES, this.plotPeakLines)
  },
  beforeDestroy() {
    this.$eventHub.$off(RENDER_PEAK_LINES);
  },
  methods: {
    async plotWaveformAndSpectrogram() {
      const audioBuffer = this.$store.state.sourceAudioBuffer;
      const DESIRED_SAMPLE_RATE = 22050;
      const windowSize = 1024;
      const resampleEvent = await resample(audioBuffer, DESIRED_SAMPLE_RATE);
      const resampledAudioBuffer = resampleEvent.renderedBuffer;
      renderWaveform(resampledAudioBuffer, this.$refs.waveform);
      const spectrogram = await renderSpectrogram(
        resampledAudioBuffer, 
        this.$refs.spectrogram, 
        windowSize, 
        DESIRED_SAMPLE_RATE
      );

      this.$store.commit({
        type: SET_SPECTROGRAM,
        spectrogram
      });
    },
    /** @param {Array.<PeakLine>} peakLines */
    plotPeakLines(peakLines) {
      renderPeakLines(peakLines, this.$store.state.spectrogram, this.$refs.peakLines)
    }
  },
  components:{
    PlayButton,
    Slider,
    MockPostButton
  }
}
</script>

<style scoped>
  #container {
    display: flex;
    margin: 0 auto;
    flex-direction: column;
    justify-content: center;
    /* width: 70%; */
    height: 100vh;
  }
  #viewerArea {
   position: relative;
   width: 100%;
   height: 420px;
   background: black;
  }
  @keyframes blinker {
    0%   { opacity: 1; }
    20%  { opacity: 1; }
    60%  { opacity: 0; }
    100% { opacity: 1; }
  }
  #peakLinesContainer {
    animation: blinker 3.6s infinite;
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
 #utilities {
   margin: 32px;
   display: flex;
   justify-content: space-between;
   align-items: center;
 }
</style>