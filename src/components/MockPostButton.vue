<template>
  <div>
    <button @click="postImage">post</button>
  </div>
</template>

<script>
import {formatAsPwt, makePNGBuffer} from '../utils/helpers';
import { RECEIVED_PWT, RENDER_PEAK_LINES } from '../constants/events';
import { PeakLine } from '../classes';

export default {
  methods: {
    postImage(){
      const { spectrogram } = this.$store.state;
      const buff = makePNGBuffer(spectrogram);
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

