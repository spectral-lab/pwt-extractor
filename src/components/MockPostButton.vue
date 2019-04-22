<template>
  <div>
    <button @click="postImage">post</button>
  </div>
</template>

<script>
import postImage from '../utils/postImage';

export default {
  methods: {
    postImage(){
      const { spectrogram } = this.$store.state;
      postImage(spectrogram, this.$eventHub);
    }
  }
}
</script>

