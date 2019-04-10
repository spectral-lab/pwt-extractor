<template>
  <div id="app">
    <OpenButton v-on:stft-completed="resultOfSTFT=$event" v-on:audio-is-ready="sourceAudioBuffer=$event"  />
    <PlayButton :sourceAudioBuffer="sourceAudioBuffer" />
    <Mock-post-button :resultOfSTFT="resultOfSTFT" />
  </div>
</template>

<script>
import OpenButton from './components/OpenButton.vue';
import PlayButton from './components/PlayButton.vue';
import MockPostButton from './components/MockPostButton.vue';
import io from 'socket.io-client';

const socketServerPort = new URL(document.location).searchParams.get('port');
const socket = io(`http://localhost:${socketServerPort}`);
socket.on("connect", () => {
  console.log(`connected with your M4L! at ${socketServerPort}`);
  const mockPWT = {
   "pitch": {
       "0":[60.3, 60.5, 58.9],
       "1":[90.5, 89.3, 82.2]
   },
   "magnitude":{
       "0":[0.1, 0.3, 0.4],
       "1":[0.5, 0.2, 0.1]
   }
  };
  socket.emit('pwt', mockPWT);
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
    MockPostButton
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
