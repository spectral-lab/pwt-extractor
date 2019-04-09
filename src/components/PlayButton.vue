<template>
  <div class="play-button">
    <svg xmlns="http://www.w3.org/2000/svg" version="1.1">
      <g>
        <image v-on:click="handleClick" x="0" y="0" width="50px" height="50px" xlink:href="../assets/play.svg" />
      </g>
    </svg>
  </div>
</template>

<script>
export default {
  name: 'PlayButton',
  props: {
    sourceAudioBuffer: AudioBuffer
  },
  methods: {
    handleClick: function () {
      if (this.sourceAudioBuffer == null) {
        return;
      }
      const context = new AudioContext({latencyHint: 'interactive', sampleRate: 22050});
      const source = context.createBufferSource(); // creates a sound source
      source.buffer = this.sourceAudioBuffer;                    // tell the source which sound to play
      source.connect(context.destination);       // connect the source to the context's destination (the speakers)
      source.start(0);
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    
</style>