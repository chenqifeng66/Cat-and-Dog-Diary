<template>
  <view class="container">
    <view class="row">
      <view>时间：</view>
      <MyDateTimePicker time @confirm="selectedDate">{{
        dateText ? dateText : "请选择时间"
      }}</MyDateTimePicker>
    </view>
    <view> </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from "vue";

const dateText = ref("");
const selectedDate = (date) => {
  console.log(date);
  dateText.value = date;
};
</script>

<style lang="less" scoped>
.container {
  margin-top: 100rpx;
  .row {
    display: flex;
  }
}
</style>
