<template>
  <div id="app">
    <openButton />
    <mock-post-button />
  </div>
</template>

<script>
import openButton from './components/openButton.vue';
import mockPostButton from './components/mockPostButton.vue';
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
   "amp":{
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
    openButton,
    mockPostButton
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
