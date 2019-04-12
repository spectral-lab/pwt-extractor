<template>
  <div>
    <button @click="postImage">post</button>
  </div>
</template>

<script>
import { PNG } from 'pngjs';
import formatAsPwt from '../utils/helpers/formatAsPwt';
import gainToDecibels from 'decibels/from-gain';
import { RECEIVED_PWT, RENDER_PEAK_LINES } from '../constants/events';

export default {
  methods: {
    postImage(){
      const { spectrogram } = this.$store.state;
      const png = new PNG({
        width: spectrogram.magnitude2d[0].length,
        height: spectrogram.magnitude2d.length,
        bitDepth: 8,
        colorType: 0,
        inputHasAlpha: false
      });
      const colors = spectrogram.magnitude2d.flat().map(magnitude => {
        const blackThreshold = -78 // in dB
        const db = gainToDecibels(magnitude);
        const filterLow = Math.max(db, blackThreshold);
        const normalized = (filterLow + Math.abs(blackThreshold))  / Math.abs(blackThreshold)
        const ret = Math.round(normalized * 255);
        return ret;
      });
      png.data = colors;
      const buff = PNG.sync.write(png);
      fetch('http://localhost:5000', {
        method: 'POST',
        body: buff,
        mode: 'cors'
      })
      .then(d => d.json())
      .then(arrayOfPartialPositions => {
        this.$eventHub.$emit(RENDER_PEAK_LINES, arrayOfPartialPositions);
        return formatAsPwt(spectrogram, arrayOfPartialPositions);
      })
      .then(pwt => {
        this.$eventHub.$emit(RECEIVED_PWT, pwt);
      })
      .catch(console.error);
    }
  }
}
</script>

