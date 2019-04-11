<template>
  <div id="app">
    <OpenButton v-on:set-audio-buffer="sourceAudioBuffer=$event" />
    <Viewer :sourceAudioBuffer="sourceAudioBuffer" v-on:stft-completed="resultOfSTFT=$event" />
    <PlayButton :playAudioBuffer="playAudioBuffer" />
    <Mock-post-button :resultOfSTFT="resultOfSTFT" :sendPwt="sendPwt" />
  </div>
</template>

<script>
import OpenButton from './components/OpenButton.vue';
import "./utils/socket";
import PlayButton from './components/PlayButton.vue';
import MockPostButton from './components/MockPostButton.vue';
import Viewer from './components/Viewer.vue';
import { playAudioBuffer } from './utils/helpers';

export default {
  name: 'app',
  components: {
    OpenButton,
    PlayButton,
    MockPostButton,
    Viewer
  },
  data () {
    return {
      sourceAudioBuffer: new AudioBuffer({
        length: 1, 
        numberOfChannels: 1, 
        sampleRate: 22050
      }),
      resultOfSTFT: {
        times: [],
        freqs: [],
        magnitude2d: []
      }
    }
  },
  watch: {
    sourceAudioBuffer: function(newBuffer) {
      this.$eventHub.$emit('audio-is-ready', newBuffer);
    }
  },
  methods: { 
    playAudioBuffer(){
      playAudioBuffer(this.sourceAudioBuffer)
    },
    sendPwt(pwt){
      socket.emit('pwt', pwt);
      console.log('sent pwt');
      console.log(pwt);
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
  overflow-x: hidden; 
  overflow-y: auto;
}
</style>