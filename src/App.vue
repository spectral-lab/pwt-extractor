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
import PlayButton from './components/PlayButton.vue';
import MockPostButton from './components/MockPostButton.vue';
import Viewer from './components/Viewer.vue';
import { playAudioBuffer } from './modules/utils';
import io from 'socket.io-client';

const socketServerPort = new URL(document.location).searchParams.get('port');
const socket = io(`http://localhost:${socketServerPort}`);
socket.on("connect", () => {
  console.log(`connected with your M4L! at ${socketServerPort}`);
});
socket.on("broadcast", msg=>{
  if(msg === 'CLOSE'){
    window.close();
  }
});
socket.on("disconnect", ()=>{
  window.close();
});

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
      socket.emit('pwt', pwt)
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