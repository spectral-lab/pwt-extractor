<template>
  <div id="main">
    <OpenFile v-if="renderOpenFile" />
    <Viewer v-if="renderViewer" />
  </div>
</template>

<script>
import OpenFile from './OpenFile.vue';
import Viewer from './Viewer.vue';
import { mapState } from 'vuex';
import screens from '../constants/screens';

export default {
  computed: mapState({
    renderOpenFile: state => state.screen === screens.OPEN_FILE,
    renderViewer: state => state.screen === screens.VIEWER,
  }),
  components: {
    OpenFile,
    Viewer,
  }
}
</script>

<style>
body {
  background: url('../../public/bg_image.jpg');
  background-size: cover;
  color: white;
  font-family: 'Helvetica Neue', 'Helvetica', 'Arial', sans-serif;
  text-align: center;
  text-shadow: rgba(0, 0, 0, 0.18) 0.15rem 0.15rem 0.5rem;
  margin: 0;
}
#main {
  margin: 0;
  overflow-x: hidden; 
  overflow-y: auto;
}
</style>
