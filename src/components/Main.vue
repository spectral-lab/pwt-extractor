<template>
  <div id="main">
    <OpenButton v-if="renderOpenFile" />
    <Viewer v-if="renderViewer" />
  </div>
</template>

<script>
import OpenButton from './OpenButton.vue';
import Viewer from './Viewer.vue';
import { mapState } from 'vuex';
import screens from '../constants/screens';

export default {
  computed: mapState({
    renderOpenFile: state => state.screen === screens.OPEN_FILE,
    renderViewer: state => state.screen === screens.VIEWER,
  }),
  components: {
    OpenButton,
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
