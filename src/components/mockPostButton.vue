<template>
  <div>
    <!-- <h2>the result of stft: {{ stftData }}</h2> -->
    <button @click="postImage">post</button>
  </div>
</template>

<script>
import { encode } from 'fast-png'
export default {
  props: {
    resultOfSTFT: {times: Array, freqs: Array, magnitude2d: Array }
  },
  methods: {
    async postImage(){
      console.log('post');
      const img = encode({
        width: this.resultOfSTFT.magnitude2d[0].length,
        height: this.resultOfSTFT.magnitude2d.length,
        data: this.resultOfSTFT.magnitude2d.flat(),
        depth: 8,
        channels: 1
      })
      const res = await fetch('https://54.238.234.108:5000', {
        method: 'POST',
        body: img.buffer,
        mode: 'cors'
      })
      .then(d=> d.json())
      .catch(e => {
        debugger;
      });
      console.log(res);
    }
  }
}
</script>

