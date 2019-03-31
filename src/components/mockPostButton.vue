<template>
  <button @click="postImage">post</button>
</template>

<script>
import formatAsPwt from '../modules/formatAsPwt';

export default {
  methods: {
    async postImage(){
      console.log('post');
      const img = await fetch('./mockSpectrogram.png')
      const ab = await img.arrayBuffer();
      const res = await fetch('http://127.0.0.1:5000', {
        method: 'POST',
        body: ab,
        mode: 'cors'
      })
      .then(d=> d.json())
      .catch(e => {
        console.error(e)
        debugger;
      });
      
      const pwt = formatAsPwt(ab, res);
      debugger;
    }
  }
}
</script>

