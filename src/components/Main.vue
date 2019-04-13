<template>
  <div id="main">
    <OpenButton />
    <Viewer />
    <PlayButton />
    <Mock-post-button />
  </div>
</template>

<script>
import OpenButton from './OpenButton.vue';
import PlayButton from './PlayButton.vue';
import MockPostButton from './MockPostButton.vue';
import Viewer from './Viewer.vue';

export default {
  components: {
    OpenButton,
    PlayButton,
    MockPostButton,
    Viewer
  }
}
</script>

<style>
#main {
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
