<template>
  <div>
    <!-- <h2>the result of stft: {{ stftData }}</h2> -->
    <button @click="postImage">post</button>
  </div>
</template>

<script>
export default {
  props: {
    resultOfSTFT: {times: Array, freqs: Array, magnitude2d: Array }
  },
  methods: {
    async postImage(){
      console.log('post');
      const img = await fetch('./mockSpectrogram.png')
      const ab = await img.arrayBuffer();
      const res = await fetch('https://54.238.234.108:5000', {
        method: 'POST',
        body: ab,
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

