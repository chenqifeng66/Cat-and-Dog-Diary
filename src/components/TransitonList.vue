<template>
  <view>
    <slot name="list" :setSlotRef="setSlotRef"></slot>
  </view>
</template>

<script setup>
import { onMounted } from "vue";
import { ref } from "vue";

const slotRef = ref(null);

const setSlotRef = (el) => {
  slotRef.value = el;
};

onMounted(() => {
  console.log(slotRef.value.$slots.default());
});
</script>
