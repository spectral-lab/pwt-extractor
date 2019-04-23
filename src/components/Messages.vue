<template>
  <div id="message-container">
    <h1 id="message">
      <span class="slidein">Here  is the Spectrogram. Check and click next. </span>
    </h1>
    <button class="button bounce" @click="postImage">Next →</button>
  </div>
</template>

<script>
import postImage from '../utils/postImage';
import { SWITCH_MODAL } from '../constants/mutation-types'
export default {
  methods: {
    async postImage(){
      const { spectrogram } = this.$store.state;
      this.$store.commit({
        type: SWITCH_MODAL,
        showModal: true
      });
      await postImage(spectrogram, this.$eventHub);
      this.$store.commit({
        type: SWITCH_MODAL,
        showModal: false
      });
    }
  }
}
</script>

<style scoped>
  #message {
    overflow:hidden;
  }
  .slidein {
    animation: slidein 1.6s;
    animation-timing-function: ease-in-out;
  }
  @keyframes slidein {
      0% { margin-left:-100vh; }
      100% { margin-left:0px; }
  }
  @-webkit-keyframes bounce {
    0%, 100% {
      -webkit-transform: translateY(0);
    }
    25%, 75% {
      -webkit-transform: translateY(-3.7px);
    }
    50% {
      -webkit-transform: translateY(-5px);
    }
  }
  @keyframes bounce {
   0%, 100% {
      -webkit-transform: translateY(0);
    }
    25%, 75% {
      -webkit-transform: translateY(-3.7px);
    }
    50% {
      -webkit-transform: translateY(-5px);
    }
  }
  @keyframes fadein {
    0% { opacity: 0; }
    60% { opacity: 0; }
    100%   { opacity: 1; }
}
  .bounce {
    -webkit-animation: bounce 0.7s infinite, fadein 4s;
    animation: bounce 0.7s infinite, fadein 4s;
    
    -webkit-animation-fill-mode: both;
    animation-fill-mode: both;
    -webkit-animation-timing-function: ease-in-out;
    animation-timing-function: ease-in-out;

  }
  #message-container {
    display: flex;
    margin: 0 auto;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    width: 90vw;
    height: 100%;
  }
  .button {
    background:none;
    border:none;
    margin:0;
    padding:0;
    cursor: pointer;
    font-family: 'Helvetica Neue', 'Helvetica', 'Arial', sans-serif;
    text-align: center;
    color: white;
    font-size: 2rem;
    font-weight: bold;
    text-shadow: rgba(0, 0, 0, 0.18) 0.15rem 0.15rem 0.5rem;
}
</style>
