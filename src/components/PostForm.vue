<template>
  <div class="modal-container">
    <div class="modal-header">
      <slot name="header">
        <h2 class="modal-header">Peak Extraction</h2>
      </slot>
    </div>
    <div class="modal-body">
      <div>
        Sensitivity  <input type="number" name="quantity" min="1" max="10" v-model="sensitivity" />
      </div>
      <div>
        Degree  <input type="number" name="quantity" min="0" max="6" v-model="degree" />
      </div>
      <div>
        <button @click="postImage">Run</button>
      </div>
    </div>
  </div>
</template>

<script>
import {formatAsPwt, makePNGBuffer} from '../utils/helpers';
import { RECEIVED_PWT, RENDER_PEAK_LINES } from '../constants/events';
import { PeakLine } from '../classes';
export default {
  props: ['proceedToLoading', 'closeModal', 'backToPostForm'],
  data: function() {
    return {
      sensitivity: 5,
      degree: 0
    };
  },
  methods: {
    postImage() {
      const { spectrogram } = this.$store.state;

      // Make formData to post
      const buff = makePNGBuffer(spectrogram.magnitude2d);
      const blob = new Blob([buff], {type: "images/png"});
      const formData = new FormData();
      formData.append("pngImage", blob);
      formData.append('sensitivity', this.$data.sensitivity);
      formData.append('degree', this.$data.degree);
      
      this.proceedToLoading();

      // Post
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
        this.closeModal();
        this.backToPostForm();
      })
      .catch(console.error);
    }
  }
}
</script>

<style>

.modal-container {
  width: 300px;
  height: 300px;
  margin: 0px auto;
  padding: 20px 30px;
  background-color: rgba(42, 42, 51, 0.9);
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(212, 175, 175, 0.33);
  transition: all .3s ease;
  font-family: Helvetica, Arial, sans-serif;
}

.modal-header {
  font-weight: lighter;
}
.modal-body {
  margin: 20px 0;
  height: 80%;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
}

</style>
