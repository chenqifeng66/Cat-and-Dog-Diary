<template>
  <view class="select">
    <view class="input" @click="onClickSelect">
      <view class="value">{{ label }}</view>
      <image
        class="icon"
        :class="{
          rotate: isShowOptions,
        }"
        src="@/assets/svgs/down.svg"
      ></image>
    </view>
    <view v-show="isShowOptions" class="option-list">
      <slot></slot>
    </view>
  </view>
</template>

<script lang="ts">
export default {
  behaviors: ["uni://form-field"],
};
</script>

<script setup lang="ts">
import { computed, ref, provide } from "vue";
const emit = defineEmits(["update:modelValue"]);
const props = defineProps({
  modelValue: [String, Number, Boolean, Object, Array],
});

const isShowOptions = ref(false);
const label = ref("");

const modelValueProxy = computed(() => props.modelValue);
provide("modelValue", modelValueProxy);
provide("updateModelValue", updateModelValue);
provide("updateLabel", updateLabel);
provide("hideOptions", hideOptions);

function updateModelValue(value: any) {
  emit("update:modelValue", value);
}

function updateLabel(newLabel: string) {
  label.value = newLabel;
}

function hideOptions() {
  isShowOptions.value = false;
}

function onClickSelect() {
  isShowOptions.value = !isShowOptions.value;
}
</script>

<style lang="less" scoped>
.select {
  position: relative;
  .input {
    height: 2.5rem;
    border: 1px solid @my-color-primary;
    border-radius: 0.5rem;
    padding: 0.3rem;
    padding-left: 1rem;
    box-sizing: border-box;
    position: relative;
    display: flex;
    align-items: center;
    .icon {
      position: absolute;
      right: 2%;
      top: 50%;
      width: 1.5rem;
      height: 1.5rem;
      transform: translateY(-50%);
      transition: all 0.3s;
    }
    .rotate {
      transform: rotateX(180deg);
      top: 20%;
    }
  }

  .option-list {
    position: absolute;
    bottom: -0.3rem;
    left: 0;
    border: 1px solid @my-color-primary;
    width: 100%;
    border-radius: 0.5rem;
    background: #fff;
    z-index: 99999;
    box-sizing: border-box;
    transform: translateY(100%);
    transition: all 1s;
    overflow: auto;
    max-height: 10rem;

    .option-item {
      padding: 0.3rem 1rem;
    }
    .active {
      color: @my-color-primary;
      background: #eaeaea;
    }
  }
}
</style>
