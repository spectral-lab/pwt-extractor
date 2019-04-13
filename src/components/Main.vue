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
    Viewer
  }
}
</script>

<style>
body {
  background: url('../../public/bg_image.jpg');
  color: white;
  font-family: 'Roboto', sans-serif;
  text-align: center;
}
#main {
  margin: 30px;
  overflow-x: hidden; 
  overflow-y: auto;
}

</style>
