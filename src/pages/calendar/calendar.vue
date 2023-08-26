<template>
  <div class="container">
    <form @submit="formSubmit">
      <div class="form-item">
        <div class="label">名称：</div>
        <input value="提醒" name="title" placeholder="输入事件名称" />
      </div>
      <div class="form-item">
        <div class="label">备注：</div>
        <input name="description" placeholder="输入事件说明" />
      </div>
      <div class="form-item">
        <div class="label">时间：</div>
        <picker
          name="time"
          mode="multiSelector"
          :value="state.dateIndex"
          :range="state.date"
          @change="onDateChange"
          @columnchange="onColumnchange"
        >
          <div>{{ selectedDate }}</div>
        </picker>
      </div>
      <div class="form-item" style="display: none">
        <div class="label">是否为全天事件</div>
        <div>
          <switch name="allDay" />
        </div>
      </div>
      <div class="btn">
        <button v-if="state.unauthorized" @click="openSetting">去授权</button>
        <button form-type="submit">设置提醒</button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, onMounted } from "vue";

const allHours = getAllHours();
const allMinutes = getMinutes();
const state = reactive({
  date: [["今天", "明天", "后天"], [], []],
  dateIndex: [0, 0, 0],
  unauthorized: false,
});

initData();

onMounted(() => {
  getAuthority();
});

function getAuthority() {
  wx.getSetting({
    success(res) {
      if (!res.authSetting["scope.addPhoneCalendar"]) {
        wx.authorize({
          scope: "scope.addPhoneCalendar",
          fail(err) {
            (state.unauthorized = true),
              uni.showToast({
                title: "请在设置中允许添加到日历",
                icon: "none",
                duration: 2000,
              });
            setTimeout(() => {
              openSetting();
            }, 2000);
          },
        });
      }
    },
  });
}

function openSetting() {
  wx.openSetting({
    fail(err) {
      console.log(err);
    },
    success(res) {
      if (res.authSetting["scope.addPhoneCalendar"]) {
        state.unauthorized = false;
      }
    },
  });
}

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
    const hour = parseInt(state.date[1][secondColIndex].split(" ")[0]);
    date.setHours(hour);
    const minute = parseInt(state.date[2][thirdColIndex].split(" ")[0]);
    date.setMinutes(minute);
    date.setSeconds(0);

    const startTime = Date.parse(date.toString()) / 1000;
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
const addTestCalendar = ({ title, startTime, description, allDay }): void => {
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
      uni.showToast({
        title: err.errMsg,
        icon: "none",
        duration: 2000,
      });
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

<style lang="less" scoped>
.container {
  color: var(--font-color);
  margin: 2rem;

  .form-item {
    display: flex;
    align-items: center;
    margin: 1rem 0;
    .label {
      margin-right: 0.5rem;
    }
    input {
      border-bottom: 1px solid #fff;
      height: 2rem;
      text-indent: 5px;
      flex: 1;
    }
  }

  .btn {
    position: fixed;
    width: 50%;
    bottom: 10rem;
    left: 50%;
    transform: translateX(-50%);

    button {
      margin-bottom: 0.2rem;
      background-color: var(--theme-color);
      color: var(--font-color);
    }
  }
}
</style>
