<template>
  <view class="form-item">
    <view class="label">{{ label }}</view>
    <slot></slot>
    <view class="tip">{{ errorMessage }}</view>
  </view>
</template>

<script setup lang="ts">
import { Ref, inject, onMounted, watch, ref } from "vue";

const props = defineProps({
  label: {
    type: String,
    default: "",
  },
  error: {
    type: String,
    default: "",
  },
  prop: {
    type: String,
  },
});

const errorMessage = ref(props.error);
const errorObj = inject("error", {}) as Ref;
const getFormItemProp = inject("getFormItemProp", () => {}) as Function;

watch(
  () => errorObj.value,
  (newVal) => {
    if (props.prop)
      if (newVal[props.prop]) {
        errorMessage.value = newVal[props.prop];
      } else {
        errorMessage.value = "";
      }
  },
  {
    deep: true,
  }
);

onMounted(() => {
  if (props.prop) getFormItemProp(props.prop);
});
</script>

<style lang="less" scoped>
.form-item {
  margin-bottom: 0.5rem;

  .tip {
    margin: 0.2rem 0;
    font-size: 0.8rem;
    color: @my-color-error;
  }
  .label {
    margin-bottom: 0.2rem;
  }
}
</style>
