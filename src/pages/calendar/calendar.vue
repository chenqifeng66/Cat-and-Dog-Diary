<template>
  <view>
    <view>
      <form @submit="formSubmit">
        <view>
          <view>事件名称</view>
          <input value="提醒事项" name="title" placeholder="输入事件名称" />
        </view>
        <view>
          <view>事件说明</view>
          <input name="description" placeholder="输入事件说明" />
        </view>
        <view>
          <view>提醒时间</view>
          <picker
            name="time"
            mode="multiSelector"
            :value="state.dateIndex"
            :range="state.date"
            @change="onDateChange"
            @columnchange="onColumnchange"
          >
            <view>{{ selectedDate }}</view>
          </picker>
        </view>
        <view>
          <view>是否为全天事件</view>
          <view>
            <switch name="allDay" />
          </view>
        </view>
        <view>
          <button form-type="submit">设置提醒</button>
          <!-- <button @click="subscribeMsg">订阅消息</button> -->
        </view>
      </form>
    </view>
  </view>
</template>

<script setup>
import { computed, reactive } from "vue";

const allHours = getAllHours();
const allMinutes = getMinutes();
const state = reactive({
  date: [["今天", "明天", "后天"], [], []],
  dateIndex: [0, 0, 0],
});

initData();

/**
 * @description: 初始化时间选择器数据
 * @return {*}
 */
function initData() {
  // 设置日
  const date = new Date();
  date.setHours(24 * 2);
  for (let i = 0; i < 100; i++) {
    date.setHours(24);
    state.date[0].push(date.getMonth() + 1 + "月" + date.getDate() + "号");
  }
  // 设置时
  for (let i = new Date().getHours(); i < 24; i++) {
    state.date[1].push(i + " 时");
  }
  // 设置分
  for (let i = new Date().getMinutes() + 1; i < 60; i++) {
    state.date[2].push(i + " 分");
  }
}

/**
 * @description: 提醒时间显示内容
 * @param {*} computed
 * @return {string} string
 */
const selectedDate = computed(() => {
  const [dayText, hourText, minuteText] = state.date;
  const [day, hour, minute] = state.dateIndex;
  return `${dayText[day]} ${hourText[hour]} ${minuteText[minute]}`;
});

/**
 * @description: 获取 0时-23时 的选择器数组
 * @return {array} array
 */
function getAllHours() {
  const allHours = [];
  for (let i = 0; i < 24; i++) {
    allHours.push(i + " 时");
  }
  return allHours;
}

/**
 * @description: 获取 0分-59分 的选择器数组
 * @return {array} array
 */
function getMinutes() {
  const allHours = [];
  for (let i = 0; i < 60; i++) {
    allHours.push(i + " 分");
  }
  return allHours;
}

/**
 * @description: 提交表单
 * @param {*} e
 */
function formSubmit(e) {
  const { value } = e.detail;
  if (!value.title.trim()) {
    uni.showToast({
      title: "事件名不能为空",
      icon: "none",
      duration: 2000,
    });
  } else {
    const { title, time, description, allDay } = value;
    const [firstColIndex, secondColIndex, thirdColIndex] = time;
    let date = new Date();
    if (firstColIndex !== 0) {
      date.setHours(24 * firstColIndex);
    }
    const hour = state.date[1][secondColIndex].split(" ")[0];
    date.setHours(hour);
    const minute = state.date[2][thirdColIndex].split(" ")[0];
    date.setMinutes(minute);
    date.setSeconds(0);

    const startTime = Date.parse(date) / 1000;
    addTestCalendar({
      title,
      startTime,
      description,
      allDay,
    });
  }
}

/**
 * @description: 订阅模板消息
 * @return {*}
 */
function subscribeMsg() {
  wx.requestSubscribeMessage({
    tmplIds: [
      "Ghil7-yhliVRUn_D4naD6G0yEdxWKJvCFnIIdYMFYj8",
      "wekPgYHspnUnIlI9ZjVF_y0zTGXTq_MHsU6fEabnbLw",
    ],
    success(res) {
      console.log(res);
    },
    fail(err) {
      console.log(err);
    },
  });
}

/**
 * @description: 添加系统日历提醒
 * @param {string} title 提醒事项名
 * @param {number} startTime 提醒时间 单位：秒
 * @param {string} description 事项备注
 * @param {boolean} allDay 是否全天事件
 */
const addTestCalendar = ({ title, startTime, description, allDay }) => {
  wx.addPhoneCalendar({
    title,
    startTime,
    description,
    allDay,
    success() {
      uni.showToast({
        title: "设置成功",
        icon: "none",
        duration: 2000,
      });
    },
    fail(err) {
      console.log("错误", err);
    },
  });
};

/**
 * @description: 当时间发生改变时赋值给响应数据
 * @param {*} e
 */
function onDateChange(e) {
  state.dateIndex = e.detail.value;
}

/**
 * @description: 当时间选择列发生改变时，改变选择范围
 * @param {*} e
 */
let isToday = true;
function onColumnchange(e) {
  console.log(e);
  const { column, value } = e.detail;
  if (column === 0) {
    if (value === 0) {
      // 获取当前时间
      isToday = true;
      state.date[1] = getCurrentHours();
      state.date[2] = getCurrentMinutes();
    } else {
      isToday = false;
      state.date[1] = allHours;
      state.date[2] = allMinutes;
    }
  } else if (column === 1) {
    if (isToday && value === 0) {
      state.date[2] = getCurrentMinutes();
    } else {
      state.date[2] = allMinutes;
    }
  }
}

/**
 * @description: 获取【当前小时】开始的选择器数组
 * @return {array} array
 */
function getCurrentHours() {
  const hour = new Date().getHours();
  const currentHours = [];
  for (let i = hour; i < 24; i++) {
    currentHours.push(i + " 时");
  }
  return currentHours;
}

/**
 * @description: 获取【当前分钟】开始的选择器数组
 * @return {array} array
 */
function getCurrentMinutes() {
  const minute = new Date().getMinutes();
  const currentMinutes = [];
  for (let i = minute + 1; i < 60; i++) {
    currentMinutes.push(i + " 分");
  }
  return currentMinutes;
}
</script>
