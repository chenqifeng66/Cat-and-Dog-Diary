<template>
  <view class="radio-group" :value="modelValue">
    <slot></slot>
  </view>
</template>

<script lang="ts">
export default {
  behaviors: ["uni://form-field"],
};
</script>

<script setup lang="ts">
import { provide, computed } from "vue";

const emit = defineEmits(["update:modelValue"]);
const props = defineProps({
  modelValue: [String, Number, Boolean],
});

const modelValueProxy = computed(() => props.modelValue);

provide("modelValue", modelValueProxy);
provide("updateModelValue", updateModelValue);

function updateModelValue(value: string | number | boolean) {
  emit("update:modelValue", value);
}
</script>

<style lang="less" scoped>
.radio-group {
  display: flex;
}
</style>
