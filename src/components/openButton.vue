<template>
  <div class="open-button">
    <input v-on:change="handleChange" ref="soundfiles" type="file" id="soundupload" accept="audio/*" />
    <div ref="waveform">
      <canvas ref="waveformCanvas" width="800" height="300">current stock price: $3.15 + 0.15</canvas>
    </div>
  </div>
</template>

<script>
// NEED REFACTORING
// This script should be split into multiple component

import { mean } from 'lodash';

export default {
  name: 'openButton',
  methods: {
    handleChange: function () {
      // subfunction to plot waveform
      const plotWaveform = (audioBuffer) => {
        const thinOutArray = (array, DESIRED_LENGTH) => {
          const denominator = Math.max(1, Math.ceil(array.length / DESIRED_LENGTH));
          const thinArray = [];
          for (let i = 0; i < array.length; i++) {
            if (i % denominator === 0) {
              thinArray.push(array[i]);
            }
          }
          return thinArray;
        }

        const DESIRED_LENGTH = 500000;
        const WAVEFORM_COLOR = 'rgb(0, 80, 180)';

        const channelData = thinOutArray(audioBuffer.getChannelData(0), DESIRED_LENGTH);
        const canvas = this.$refs.waveformCanvas;
        const ctx = canvas.getContext('2d');
        const centerAxis = canvas.height * 0.5;
        const coef = canvas.height * 0.5;
        const interval = canvas.width / ( channelData.length - 1 )

        //  draw
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.lineWidth = 1;
        ctx.globalCompositeOperation = 'screen';
        ctx.strokeStyle = WAVEFORM_COLOR;
        ctx.beginPath();
        
        let px = 0;
        let py = centerAxis + coef * channelData[0];
        ctx.moveTo(px, py);
        
        for (let i = 1; i < channelData.length; i++) {
          px += interval;
          py = centerAxis + coef * channelData[i];
          ctx.lineTo(px, py);
        }
        ctx.stroke();
      }

      // subfunction to monauralize audio Buffer
      const monauralize = (sourceAudioBuffer) => {
        const channelDataArray = []
        for (let channel = 0; channel < sourceAudioBuffer.numberOfChannels; channel++) {
          channelDataArray.push(sourceAudioBuffer.getChannelData(channel));
        }
        const monauralizedChannelData = new Float32Array(sourceAudioBuffer.length);
        for (let i = 0; i < sourceAudioBuffer.length; i++) {
          const sampleFrame = channelDataArray.map((channelData) => channelData[i]);
          monauralizedChannelData[i] = mean(sampleFrame);
        }
        const offlineCtx = new OfflineAudioContext(1, sourceAudioBuffer.length , sourceAudioBuffer.sampleRate);
        const targetBuffer = offlineCtx.createBuffer(1, sourceAudioBuffer.length, sourceAudioBuffer.sampleRate);
        targetBuffer.copyToChannel(monauralizedChannelData, 0);
        return targetBuffer;       
      }
      
      // subfunction to crop audio buffer
      const cropAudioBuffer = (sourceAudioBuffer, DESIRED_DURATION) => {
        if (sourceAudioBuffer.duration < DESIRED_DURATION) {
          return sourceAudioBuffer
        }
        const offlineCtx = new OfflineAudioContext(sourceAudioBuffer.numberOfChannels, sourceAudioBuffer.sampleRate * DESIRED_DURATION , sourceAudioBuffer.sampleRate);
        const targetBuffer = offlineCtx.createBuffer(sourceAudioBuffer.numberOfChannels, sourceAudioBuffer.sampleRate * DESIRED_DURATION, sourceAudioBuffer.sampleRate);
        for (let channel = 0; channel < sourceAudioBuffer.numberOfChannels; channel++) {
            targetBuffer.copyToChannel(sourceAudioBuffer.getChannelData(channel), channel);
        }
        return targetBuffer;
      }

      // subfunction to normalize gain of audio buffer
      const normalizeGain = (sourceAudioBuffer) => {
        let max = 0
        for (let channel = 0; channel < sourceAudioBuffer.numberOfChannels; channel++) {
          const channelData = sourceAudioBuffer.getChannelData(channel)
          for (let i = 0; i < channelData.length; i++) {
            max = Math.max(Math.abs(channelData[i]), max)
          }
        }

        const ratio = max === 0 ? 1 : 1 / max;

        const normalizedChannelDataArray = []
        
        for (let channel = 0; channel < sourceAudioBuffer.numberOfChannels; channel++) {
          const channelData = sourceAudioBuffer.getChannelData(channel);
          const normalizedChannelData = new Float32Array(sourceAudioBuffer.length);
          for (let i = 0; i < channelData.length; i++) {
            normalizedChannelData[i] = channelData[i] * ratio
          }
          normalizedChannelDataArray.push(normalizedChannelData);
        }

        const offlineCtx = new OfflineAudioContext(sourceAudioBuffer.numberOfChannels, sourceAudioBuffer.length , sourceAudioBuffer.sampleRate);
        const targetBuffer = offlineCtx.createBuffer(sourceAudioBuffer.numberOfChannels, sourceAudioBuffer.length, sourceAudioBuffer.sampleRate);
        
        for (let channel = 0; channel < sourceAudioBuffer.numberOfChannels; channel++) {
            targetBuffer.copyToChannel(normalizedChannelDataArray[channel], channel);
        }

        return targetBuffer;
      };

      // subfunction to resample audio buffer
      const resample = (sourceAudioBuffer, DESIRED_SAMPLE_RATE) => {
        const offlineCtx = new OfflineAudioContext(sourceAudioBuffer.numberOfChannels, sourceAudioBuffer.duration * DESIRED_SAMPLE_RATE, DESIRED_SAMPLE_RATE);
        const cloneBuffer = offlineCtx.createBuffer(sourceAudioBuffer.numberOfChannels, sourceAudioBuffer.length, sourceAudioBuffer.sampleRate);
        // Copy the source data into the offline AudioBuffer
        for (let channel = 0; channel < sourceAudioBuffer.numberOfChannels; channel++) {
            cloneBuffer.copyToChannel(sourceAudioBuffer.getChannelData(channel), channel);
        }
        // Render it from the beginning.
        const source = offlineCtx.createBufferSource();
        source.buffer = cloneBuffer;
        source.connect(offlineCtx.destination);
        offlineCtx.oncomplete = function(e) {
          // `resampledAudioBuffer` contains an AudioBuffer resampled at 16000Hz.
          // use resampled.getChannelData(x) to get an Float32Array for channel x.
          const resampledAudioBuffer = e.renderedBuffer;
          // use this float32array to send the samples to the server or whatever
          plotWaveform(resampledAudioBuffer);
        }
        offlineCtx.startRendering();
        source.start(0);
      }

      // Main
      const context = new AudioContext({latencyHint: 'interactive', sampleRate: 20500});
      const f = this.$refs.soundfiles.files[0];
      const reader = new FileReader();
      const DESIRED_DURATION = 10; //in seconds.
      const DESIRED_SAMPLE_RATE = 22050;
      reader.onload = function(e) {
        context.decodeAudioData(e.target.result, function(originalAudioBuffer) {
          const monoAudioBuffer = monauralize(originalAudioBuffer);
          const croppedAudioBuffer = cropAudioBuffer(monoAudioBuffer , DESIRED_DURATION);
          const normalizedAudioBuffer = normalizeGain(croppedAudioBuffer);
          resample(normalizedAudioBuffer, DESIRED_SAMPLE_RATE);
        }, console.error);
      };
      reader.readAsArrayBuffer(f);
    },
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    canvas {
      background-color: #13161A;
    }

</style>