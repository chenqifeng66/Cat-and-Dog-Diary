<template>
  <view v-if="isShow" class="dialog-container">
    <view class="dialog">
      <view class="content">
        <view class="title">{{ dialog.title }}</view>
        <view class="desc">{{ dialog.content }}</view>
      </view>
      <view class="handle">
        <view class="cancel" @click="cancel">{{
          dialog.cancelText || "取消"
        }}</view>
        <view class="confirm" @click="confirm">{{
          dialog.cancelText || "确认"
        }}</view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";

const isShow = ref(false);
const dialog = reactive({
  title: "",
  content: "",
  confirmText: "",
  cancelText: "",
  confirm: Function,
});

function open(options) {
  if (typeof options === "object") Object.assign(dialog, options);
  isShow.value = true;
}

function cancel() {
  isShow.value = false;
}

function confirm() {
  dialog.confirm && dialog.confirm();
  isShow.value = false;
}

defineExpose({
  open,
  confirm,
});
</script>

<style lang="less" scoped>
.dialog-container {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #00000098;
  z-index: 9999;

  .dialog {
    background: #fff;
    border-radius: 1rem;
    overflow: hidden;
    color: #aaa;
    width: 80vw;

    .content {
      padding: 1rem 1.5rem;
      .title {
        color: @my-color-primary;
        font-weight: bold;
        font-size: 1.5rem;
        margin-bottom: 1rem;
      }
    }

    .handle {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      font-size: 1.2rem;
      padding: 0.8rem 1.5rem;
      background: #f8f8f8;

      .cancel {
        margin-right: 1rem;
      }
      .confirm {
        background: @my-color-primary;
        color: #fff;
        padding: 0.2rem 1rem;
        border-radius: 0.3rem;

        font-weight: bold;
      }
    }
  }
}
</style>
