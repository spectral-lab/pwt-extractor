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
import { PeakLine } from '../classes';

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
      png.data = spectrogram.magnitude2d.flat().map(magnitude => {
        const blackThreshold = -78 // in dB
        const db = gainToDecibels(magnitude);
        const filterLow = Math.max(db, blackThreshold);
        const normalized = (filterLow + Math.abs(blackThreshold))  / Math.abs(blackThreshold)
        const ret = Math.round(normalized * 255);
        return ret;
      });
      const buff = PNG.sync.write(png);
      fetch(process.env.VUE_APP_SERVER, {
        method: 'POST',
        body: buff,
        mode: 'cors'
      })
      .then(d => d.json())
      .then(_feature_lines => {
        /**
         * All points detected as peak. Array is splited into chunks. Each chunk corresponds to each line.
         * @type {Array.<Array.<Array.<Number>>>} 
         */
        const feature_lines = _feature_lines;
        const peakLines = feature_lines.map((pointsInOneLine, idx) => {
          return new PeakLine(pointsInOneLine, spectrogram, idx);
        });
        this.$eventHub.$emit(RENDER_PEAK_LINES, peakLines);
        return formatAsPwt(spectrogram, peakLines);
      })
      .then(pwt => {
        this.$eventHub.$emit(RECEIVED_PWT, pwt);
      })
      .catch(console.error);
    }
  }
}
</script>

