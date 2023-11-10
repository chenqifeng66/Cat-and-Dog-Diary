<template>
  <view class="form">
    <slot></slot>
  </view>
</template>

<script setup lang="ts">
import { computed, ref, provide } from "vue";
import Schema from "async-validator";

// 去除警告信息
Schema.warning = function () {};

const props = defineProps({
  model: {
    type: Object,
    default: () => {},
  },
  rules: {
    type: Object,
    default: () => {},
  },
});

const formItemProps: string[] = [];
const error: any = ref({});
const formRules = computed(() => props.rules);
const formModel = computed(() => props.model);

provide("getFormItemProp", getFormItemProp);
provide("error", error);

function getFormItemProp(prop: string) {
  formItemProps.push(prop);
}

async function validate(callback: Function) {
  // 对所有带有prop属性的formItem组件进行校验
  let isValidatePass = true;
  for (let i = 0; i < formItemProps.length; i++) {
    const prop = formItemProps[i];
    try {
      await validateItem(prop);
    } catch (error) {
      isValidatePass = false;
    }
  }
  if (isValidatePass) {
    //校验通过
    callback(true);
  } else {
    callback(false);
  }
}

async function validateItem(prop: string) {
  return new Promise(async (resolve, reject) => {
    let validateCount = 0;
    const propRulesLength = formRules.value[prop].length;
    for (let k = 0; k < propRulesLength; k++) {
      const validator = new Schema({
        [prop]: formRules.value[prop][k],
      });
      try {
        // 校验
        await validator.validate({
          [prop]: formModel.value[prop],
        });
        if (prop in error.value) {
          delete error.value[prop];
        }
        validateCount++;
      } catch (err: any) {
        // 提示错误消息
        error.value[prop] = err.errors[0].message;
        break;
      }
    }
    if (validateCount === propRulesLength) {
      resolve(null);
    } else {
      reject();
    }
  });
}

defineExpose({
  validate,
});
</script>
