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
      const buff = makePNGBuffer(spectrogram.magnitude2d);
      const blob = new Blob([buff], {type: "images/png"});
      const formData = new FormData();
      formData.append("pngImage", blob);
      formData.append('line_continuity', 2);
      fetch(process.env.VUE_APP_SERVER, {
        method: 'POST',
        body: formData,
        mode: 'cors'
      })
      .then(d => d.json())
      .then(_featureLines => {
        /**
         * All points detected as peak. Array is splited into chunks. Each chunk corresponds to each line.
         * @type {Array.<Array.<Array.<Number>>>} 
         */
        const featureLines = _featureLines;
        const peakLines = featureLines.map((pointsInOneLine, idx) => {
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

