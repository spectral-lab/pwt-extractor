<template>
  <div id="container">
    <mock-post-button />
    <div id="viewerArea">
      <div class="viewer-child-container spectrogram" :style="spectrogram">
        <canvas id="spectrogram" ref="spectrogram" />
      </div>
      <div class="viewer-child-container waveform" :style="waveform">
        <canvas id="waveform" ref="waveform" />
      </div>
      <div class="viewer-child-container spectrogram" :style="spectrogram">
        <canvas id="peakLines" ref="peakLines" />
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
import { renderWaveform, renderSpectrogram } from '../utils/plot'
import { SET_SPECTROGRAM } from '../constants/mutation-types';

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
      // Work In Progress
      console.log(peakLines)
      console.log("Partial Viwer is under construction");
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