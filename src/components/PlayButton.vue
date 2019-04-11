<template>
  <div class="play-button">
    <svg xmlns="http://www.w3.org/2000/svg" version="1.1">
      <g>
        <image v-on:click="playAudioBuffer" x="0" y="0" width="50px" height="50px" xlink:href="../assets/play.svg" />
      </g>
    </svg>
  </div>
</template>

<script>
export default {
  name: 'PlayButton',
  props: ['playAudioBuffer'],
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    
</style>