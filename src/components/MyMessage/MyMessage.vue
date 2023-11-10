<template>
  <view v-if="isShow" class="message">
    <image
      v-if="isSuccess"
      class="icon success"
      src="@/assets/svgs/done.svg"
    ></image>
    <image
      v-if="isError"
      class="icon error"
      src="@/assets/svgs/close.svg"
    ></image>

    <view
      class="text"
      :class="{
        success: isSuccess,
        error: isError,
      }"
      ><slot v-if="!message"></slot> {{ message ? message : "" }}</view
    >
  </view>
</template>

<script setup lang="ts">
import { computed, nextTick, ref } from "vue";

let timer: NodeJS.Timeout;
const isShow = ref(false);
const message = ref("");
const duration = ref(2000);
const type = ref("success");

const isSuccess = computed(() => {
  return type.value === "success";
});
const isError = computed(() => {
  return type.value === "error";
});

function show(options) {
  if (isShow.value) {
    timer && clearTimeout(timer);
    isShow.value = false;
  }
  if (options.message) {
    if (options.duration) {
      duration.value = options.duration;
    } else {
      duration.value = 2000;
    }
    if (options.type) {
      type.value = options.type;
    } else {
      type.value = "success";
    }
    nextTick(() => {
      isShow.value = true;
      message.value = options.message;
      timer = setTimeout(() => {
        isShow.value = false;
        options.complete && options.complete();
      }, duration.value);
    });
  }
}

defineExpose({
  show,
});
</script>

<style lang="less" scoped>
.message {
  display: flex;
  align-items: center;
  background: #fff;
  padding: 0.5rem 1rem;
  border-radius: 0.3rem;
  position: fixed;
  left: 50%;
  top: 5%;
  transform: translateX(-50%);
  min-width: 1rem;
  box-sizing: border-box;
  box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.1);
  animation: show 0.5s 1 ease-in-out;
  z-index: 99999;

  @keyframes show {
    from {
      opacity: 0;
      top: -10%;
    }
  }

  .icon {
    width: 1rem;
    height: 1rem;
    border-radius: 50%;
    margin-right: 0.5rem;

    &.success {
      background: @my-color-primary;
    }
    &.error {
      background: #ff4747d3;
    }
  }

  .text {
    display: inline;
    &.success {
      color: @my-color-primary;
    }
    &.error {
      color: #ff4747d3;
    }
  }
}
</style>
