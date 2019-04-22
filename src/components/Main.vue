<template>
  <div id="main">
    <OpenFile v-if="renderOpenFile" />
    <Messages class="messages" v-if="renderViewer" />
    <Viewer class="viewer" v-if="renderViewer" />
    <Utilities class="utilities" v-if="renderViewer" />
    <Modal v-if="showModal" />
  </div>
</template>

<script>
import OpenFile from './OpenFile.vue';
import Viewer from './Viewer.vue';
import { mapState } from 'vuex';
import screens from '../constants/screens';
import Utilities from './Utilities.vue';
import Messages from './Messages.vue'
import Modal from './Modal.vue'

export default {
  computed: mapState({
    renderOpenFile: state => state.screen === screens.OPEN_FILE,
    renderViewer: state => state.screen === screens.VIEWER,
    showModal: state => state.showModal === true
  }),
  components: {
    OpenFile,
    Viewer,
    Utilities,
    Messages,
    Modal
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
.messages {
  margin: 0;
  height: 20vh;
}
.viewer {
  margin: 0;
  height: 60vh;
}
.utilities {
  margin: 0;
  height: 20vh;
}

</style>
