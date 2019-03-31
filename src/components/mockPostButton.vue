<template>
  <button @click="postImage">post</button>
</template>

<script>
export default {
  methods: {
    async postImage(){
      console.log('post');
      const img = await fetch('./mock.png')
      const ab = await img.arrayBuffer();
      const res = await fetch('http://localhost:5000', {
        method: 'POST',
        body: ab,
        mode: 'cors'
      })
      .then(d=> d.json())
      .catch(e => {
        debugger;
      });
      console.log(res);
      debugger;
    }
  }
}
</script>

