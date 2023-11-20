<template>
  <view v-if="show">
    <view
      class="popup-container"
      :class="{
        bottom: position === 'bottom',
      }"
      @click="hidePopup"
    >
      <view
        class="popup"
        :class="{
          bottom: position === 'bottom',
        }"
        @click.stop="stop"
      >
        <slot> </slot>
      </view> </view
  ></view>
</template>

<script setup lang="ts">
defineProps({
  show: {
    type: Boolean,
    default: false,
  },
  position: {
    type: String,
    validator(value: string) {
      return ["center", "bottom"].includes(value);
    },
    default: "center",
  },
});

const emit = defineEmits(["hide"]);

function hidePopup() {
  emit("hide");
}

function stop() {}
</script>

<style lang="less" scoped>
.popup-container {
  position: fixed;
  inset: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #00000098;
  z-index: 9999;

  &.bottom {
    align-items: flex-end;
  }

  .popup {
    background: #fff;
    min-width: 30vw;
    min-height: 2rem;
    border-radius: 2rem;
    box-sizing: border-box;
    padding: 1.5rem;
    // animation: show 0.5s ease-in-out;
    transition: all 0.5s ease-in-out;

    // @keyframes show {
    //   from {
    //     transform: translateY(100%);
    //   }
    //   to {
    //     transform: translateY(0);
    //   }
    // }

    &.bottom {
      width: 100vw;
      height: 50vh;
      border-radius: 2rem 2rem 0 0;
    }
  }
}
</style>
