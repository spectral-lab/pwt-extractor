<template>
  <div class="instruction">
    <div>
      First, please open audio file to extract
      <br/>
      Polyphonic Wave Table
    </div>
    <div class="button-container">
      <button class="button" @click="handleClick">
        Next →
      </button>
    </div>
  </div>
</template>

<script>
  import { SWITCH_PAGE } from "../constants/mutation-types";
  import pages from "../constants/pages";
	export default {
    methods: {
      handleClick() {
        this.$store.commit(SWITCH_PAGE, {page: pages.OPEN_FILE})
      }
    }
  };
</script>

<style scoped>
  .instruction {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    height: 100%;
    font-size: 2.5rem;
    text-align: left;
    padding: 10rem;
    height: calc(100vh - 20rem);
  }
  .button-container {
    display: flex; 
    width: 100%;
    justify-content: right;
  }
  .button {
    background: none;
    border: none;
    color: inherit;
    font-size: inherit;
    cursor: pointer;
  }
</style>