<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png">
    <HelloWorld msg="Welcome to Your Vue.js App"/>
    <openButton />
  </div>
</template>

<script>
// import HelloWorld from './components/HelloWorld.vue';
import openButton from './components/openButton.vue';
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
    // HelloWorld,
    openButton
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
}
</style>
