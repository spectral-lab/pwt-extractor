<template>
  <div class="modal-container">
    <div class="modal-header">
      <slot name="header">
        <h2 class="modal-header">Now calculating...</h2>
        <h2 class="modal-header">Just a moment.</h2>
      </slot>
    </div>
    <div class="modal-body">
      <slot name="body">
        <progress max="100" value="100"></progress>
      </slot>
    </div>
  </div>
</template>

<script>
export default {

}
</script>

<style>

.modal-container {
  width: 300px;
  margin: 0px auto;
  padding: 20px 30px;
  background-color: rgba(42, 42, 51, 0.9);
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(212, 175, 175, 0.33);
  transition: all .3s ease;
  font-family: Helvetica, Arial, sans-serif;
}

.modal-header {
  font-weight: lighter;
}
.modal-body {
  margin: 20px 0;
}

</style>
