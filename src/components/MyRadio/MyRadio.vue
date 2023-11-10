<template>
  <view class="radio" @click="checked">
    <view class="check">
      <view v-show="isChecked" class="active"></view>
    </view>
    <view
      class="label"
      :class="{
        active: isChecked,
      }"
      >{{ label }}</view
    >
  </view>
</template>

<script setup lang="ts">
import { computed, inject, Ref } from "vue";

const modelValue = inject("modelValue") as Ref;
const updateModelValue = inject("updateModelValue") as Function;
const props = defineProps({
  value: {
    type: [String, Number, Boolean],
    required: true,
  },
  label: String,
});

const isChecked = computed(() => {
  return modelValue.value === props.value;
});

function checked() {
  updateModelValue(props.value);
}
</script>

<style lang="less" scoped>
.radio {
  display: flex;
  align-items: center;
  margin-right: 0.5rem;
  color: @my-text-color-grey;
  .check {
    width: 1rem;
    height: 1rem;
    border: 1px solid @my-text-color-grey;
    border-radius: 50%;
    margin-right: 0.5rem;
    box-sizing: border-box;
    position: relative;
    .active {
      width: 0.5rem;
      height: 0.5rem;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: @my-color-primary;
      border-radius: 50%;
      animation: active 0.5s 1;

      @keyframes active {
        from {
          width: 0rem;
          height: 0rem;
        }
        to {
          width: 0.5rem;
          height: 0.5rem;
        }
      }
    }
  }
  .active {
    color: @my-color-primary;
    border-color: @my-color-primary;
  }
}
</style>
