<template>
  <div class="open-button">
    <input v-on:change="handleChange" ref="soundfiles" type="file" id="soundupload" accept="audio/*" />
    <div>
      <canvas ref="waveform" width="800" height="300">waveform</canvas>
      <canvas ref="spectrogram" width="800" height="300">spectrogram</canvas>
    </div>
    <svg xmlns="http://www.w3.org/2000/svg" version="1.1">
      <g>
        <image v-on:click="handlePlayButton" x="0" y="0" width="50px" height="50px" xlink:href="../assets/play.svg" />
      </g>
    </svg>
  </div>
</template>

<script>
import { sumToMono, normalize, crop, resample } from '../modules/audioBufferProcess'
import { waveform, spectrogram } from '../modules/plot'

const windowSize = 2048;
const context = new AudioContext({latencyHint: 'interactive', sampleRate: 20500});
let normalizedAudioBuffer;

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
      const f = this.$refs.soundfiles.files[0];
      const DESIRED_DURATION = 10; //in seconds.
      const DESIRED_SAMPLE_RATE = 22050;
      const loadEvent = await loadFileAsArrayBuffer(f);
      const originalAudioBuffer = await context.decodeAudioData(loadEvent.target.result);
      const monoAudioBuffer = sumToMono(originalAudioBuffer);
      const croppedAudioBuffer = crop(monoAudioBuffer , DESIRED_DURATION);
      normalizedAudioBuffer = normalize(croppedAudioBuffer);
      const resampleEvent = await resample(normalizedAudioBuffer, DESIRED_SAMPLE_RATE);
      const resampledAudioBuffer = resampleEvent.renderedBuffer;
      spectrogram(resampledAudioBuffer, this.$refs.spectrogram, windowSize, DESIRED_SAMPLE_RATE);
      waveform(resampledAudioBuffer, this.$refs.waveform);
    },
    handlePlayButton: function () {
      if (normalizedAudioBuffer == null) {
        return;
      }
      const source = context.createBufferSource(); // creates a sound source
      source.buffer = normalizedAudioBuffer;                    // tell the source which sound to play
      source.connect(context.destination);       // connect the source to the context's destination (the speakers)
      source.start(0);
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