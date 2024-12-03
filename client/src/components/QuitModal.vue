
<template>
  <div class="modal-overlay">
    <div class="modal">
      <p>If you quit, you will lose the match.</p>
      <p>Are you sure you want to quit?</p>
      <div class="modal-actions">
        <button @click="confirmQuit" class="btn-confirm">Yes, quit</button>
        <button @click="cancelQuit" class="btn-cancel">No, go back</button>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  setup(_, { emit }) {
    const confirmQuit = () => {
      emit("confirm");
    };
    const cancelQuit = () => {
      emit("cancel");
    };
    return {
      confirmQuit,
      cancelQuit,
    };
  },
};
</script>

<style>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  text-align: center;
  max-width: 400px;
  width: 90%;
}

.modal-actions {
  margin-top: 20px;
  display: flex;
  justify-content: space-around;
}

.btn-confirm {
  background: #d9534f;
  color: #fff;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
}

.btn-cancel {
  background: #9e9e9e;
  color: #fff;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
}

.btn-confirm:hover,
.btn-cancel:hover {
  opacity: 0.9;
}
</style>
