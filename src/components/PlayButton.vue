<template>
  <div id="buttonContainer" @click="handleClick" class="play-button">
    <img src="../assets/play.svg" alt="">
  </div>
</template>

<script>
import { playAudioBuffer } from '../utils/helpers';
export default {
  methods: {
    handleClick(){
      const ab = this.$store.state.sourceAudioBuffer;
      playAudioBuffer(ab)
    }
  }
}
</script>

<style scoped>
#buttonContainer {
  height: 64px;
}
img {
  height: 100%;
}
</style>
