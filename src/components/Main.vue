<template>
  <div id="main">
    <video-bg :sources="[path]">
      <slot>
        <div id="mask">
          <Instruction v-if="renderInstruction" />
          <OpenFile v-if="renderOpenFile" />
          <Viewer v-if="renderViewer" />
        </div>
      </slot>
    </video-bg>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import Instruction from '../pages/Instruction.vue';
import OpenFile from '../pages/OpenFile.vue';
import Viewer from '../pages/Viewer.vue';
import pages from '../constants/pages';
import bgVideoPath from '../../public/bg_video.mp4'

export default {
  computed: mapState({
    renderInstruction: state => state.page === pages.INSTRUCTION,
    renderOpenFile: state => state.page === pages.OPEN_FILE,
    renderViewer: state => state.page === pages.VIEWER,
  }),
  data () {
   return {
     path: bgVideoPath
    }
  },
  components: {
    Instruction,
    OpenFile,
    Viewer
  }
}
</script>

<style>
body {
  /* background: url('../../public/bg_image.jpg'); */
  background: rgb(43, 43, 43);
  background-size: cover;
  color: white;
  font-family: 'Helvetica Neue', 'Helvetica', 'Arial', sans-serif;
  text-align: center;
  text-shadow: rgba(0, 0, 0, 0.28) 0.15rem 0.15rem 0.5rem;
  margin: 0;
}
#main {
  margin: 0;
  overflow-x: hidden; 
  overflow-y: auto;
}
#mask {
  position: fixed;
  background-color: rgba(0,0,0,0.55);
  min-width: 100vw;
  min-height: 100vh;
}

</style>
