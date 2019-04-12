<template>
  <div>
    <!-- <h2>the result of stft: {{ stftData }}</h2> -->
    <button @click="postImage">post</button>
  </div>
</template>

<script>
import { PNG } from 'pngjs';
import formatAsPwt from '../modules/formatAsPwt';
import gainToDecibels from 'decibels/from-gain';

export default {
  props: {
    resultOfSTFT: {times: Array, freqs: Array, magnitude2d: Array }
  },
  methods: {
    async postImage(){
      console.log('post');
      const png = new PNG({
        width: this.resultOfSTFT.magnitude2d[0].length,
        height: this.resultOfSTFT.magnitude2d.length,
        bitDepth: 8,
        colorType: 0,
        inputHasAlpha: false
      });
      const colors = this.resultOfSTFT.magnitude2d.flat().map(magnitude => {
        const blackThreshold = -78 // in dB
        const db = gainToDecibels(magnitude);
        const filterLow = Math.max(db, blackThreshold);
        const normalized = (filterLow + Math.abs(blackThreshold))  / Math.abs(blackThreshold)
        const ret = Math.round(normalized * 255);
        return ret;
      });
      png.data = colors;
      const buff = PNG.sync.write(png);
      const res = await fetch('http://localhost:5000', {
        method: 'POST',
        body: buff,
        mode: 'cors'
      })
      .then(d => d.json())
      .catch(e => {
        console.log(e);
      });
      const arrayOfPartialPositions = res;
      this.$eventHub.$emit('partials-are-ready', arrayOfPartialPositions);
      this.$attrs.sendPwt(formatAsPwt(this.resultOfSTFT, arrayOfPartialPositions));
    }
  }
}
</script>

