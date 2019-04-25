<template>
  <div id="utilities-container">
    <div id="playButtonContainer">
      <play-button />
    </div>
    <h1 id="songname" class="text">{{fileName}}</h1>
    <div class="text">window size: 1024</div>
  </div>
</template>

<script>
import PlayButton from './PlayButton.vue';
export default {
  computed: {
    fileName() {
      return this.$store.state.fileName;
    }
  },
  components: {
    PlayButton,
  }
}
</script>

<style scoped>
  #utilities-container {
    display: flex;
    margin: 0 auto;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    width: 90vw;
    height: 100%;
  }
  #songname {
    color: rgb(255, 255, 255);
    background: rgba(42, 42, 51, 0.9);
    /* background: linear-gradient(90deg, rgba(49, 51, 53, 0.83) 0%, rgba(53, 58, 59, 0.83) 50%, rgba(49, 51, 53, 0.83) 100%); */
    padding: 1rem 3rem;
    text-shadow: 0px 0px;
    font-size: 1.5rem;
    font-weight:100;
  }
</style>
