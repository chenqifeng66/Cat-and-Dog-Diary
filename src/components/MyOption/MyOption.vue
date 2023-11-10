<template>
  <view
    class="option"
    :class="{
      active: isActive,
    }"
    @click="clickOption"
    >{{ label }}</view
  >
</template>

<script setup lang="ts">
import { onMounted, Ref, computed, inject } from "vue";

const props = defineProps({
  label: String,
  value: [String, Number, Boolean, Object],
});

const modelValue = inject("modelValue") as Ref;
const updateModelValue = inject("updateModelValue") as Function;
const updateLabel = inject("updateLabel") as Function;
const hideOptions = inject("hideOptions") as Function;

const isActive = computed(() => {
  return modelValue.value === props.value;
});

onMounted(() => {
  if (isActive.value) updateLabel(props.label);
});

function clickOption() {
  updateModelValue(props.value);
  updateLabel(props.label);
  hideOptions();
}
</script>

<style lang="less" scoped>
.option {
  padding: 0.3rem 1rem;
}
.active {
  color: @my-color-primary;
  background: #f2f2f2;
}
</style>
