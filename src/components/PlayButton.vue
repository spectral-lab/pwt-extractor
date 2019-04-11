<template>
  <div @click="handleClick" class="play-button">
    <svg xmlns="http://www.w3.org/2000/svg" version="1.1">
      <g>
        <image @click="handleClick" x="0" y="0" width="50px" height="50px" xlink:href="../assets/play.svg" />
      </g>
    </svg>
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