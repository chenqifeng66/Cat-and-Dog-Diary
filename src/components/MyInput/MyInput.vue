<template>
  <input
    class="input"
    :type="type"
    :maxlength="maxLength"
    :value="modelValue"
    @input="inputChange"
  />
</template>

<script lang="ts">
export default {
  behaviors: ["uni://form-field"],
};
</script>

<script setup lang="ts">
import { PropType } from "vue";

type Type =
  | "text"
  | "number"
  | "idcard"
  | "digit"
  | "tel"
  | "safe-password"
  | "nickname";

defineProps({
  type: {
    type: String as PropType<Type>,
    default: "text",
  },
  maxLength: {
    type: Number,
    default: 140,
  },
  modelValue: {
    type: [String, Number],
    default: "",
  },
});
const emit = defineEmits(["update:modelValue"]);

function inputChange(e: any) {
  emit("update:modelValue", e.detail.value);
}
</script>

<style lang="less" scoped>
.input {
  border: 1px solid @my-color-primary;
  border-radius: 0.5rem;
  height: 2rem;
  padding-left: 0.8rem;
}
</style>
