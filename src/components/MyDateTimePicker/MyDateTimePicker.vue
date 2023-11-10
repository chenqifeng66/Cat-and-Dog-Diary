<template>
  <view>
    <view class="input" @click="showPopup">
      <text v-if="modelValue">{{ modelValue }}</text>
      <text v-else class="placeholder">请选择时间</text></view
    >
    <MyPopup
      class="popup"
      position="bottom"
      :show="state.show"
      @hide="hidePopup"
    >
      <view class="handle">
        <view class="cancel" @click="hidePopup">取消</view>
        <view class="confirm" @click="confirm">确定</view>
      </view>
      <picker-view
        class="picker-view"
        :value="state.initSelectedIndexs"
        @change="change"
      >
        <template v-if="date">
          <picker-view-column class="picker-view-column">
            <view
              class="item"
              v-for="(item, index) in state.date"
              :key="index"
              >{{ formatDate(item) }}</view
            >
          </picker-view-column>
        </template>
        <template v-if="time"
          ><picker-view-column class="picker-view-column">
            <view class="item" v-for="(item, index) in state.hours" :key="index"
              >{{ item }}时</view
            >
          </picker-view-column>
          <picker-view-column class="picker-view-column">
            <view
              class="item"
              v-for="(item, index) in state.minutes"
              :key="index"
              >{{ item }}分</view
            >
          </picker-view-column></template
        >
      </picker-view>
    </MyPopup>
  </view>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive } from "vue";
import { generateArray } from "../../utils/methods";

interface Date {
  year: string;
  month: string;
  day: string;
}

const emit = defineEmits(["update:modelValue", "confirm"]);
const props = defineProps({
  modelValue: {
    type: String || Number,
    required: true,
  },
  startTime: {
    type: Number,
    default: Date.now() - 1000 * 3600 * 24 * 180,
  },
  endTime: {
    type: Number,
    default: Date.now(),
  },
  // 是否需要时间
  time: {
    type: Boolean,
    default: false,
  },
  // 是否需要日期
  date: {
    type: Boolean,
    default: true,
  },
});

// 月份数据
const MONTH_RANGE = generateArray(1, 12, (index) => {
  if (index < 10) {
    return "0" + index;
  } else {
    return index.toString();
  }
});
// 天数据
const DAY_RANGE = generateArray(1, 31, (index) => {
  if (index < 10) {
    return "0" + index;
  } else {
    return index.toString();
  }
});
// 时数据
const HOUR_RANGE = generateArray(0, 23, (index) => {
  if (index < 10) {
    return "0" + index;
  } else {
    return index.toString();
  }
});
// 分数据
const MINUTE_RANGE = generateArray(0, 59, (index) => {
  if (index < 10) {
    return "0" + index;
  } else {
    return index.toString();
  }
});
const state = reactive({
  // 初始选中索引长度等于二维数组长度，每一个索引代表每一列选中索引
  initSelectedIndexs: [] as Array<number>,
  // 选中索引长度等于二维数组长度，每一个索引代表每一列选中索引
  selectedIndexs: [] as Array<number>,
  date: [] as Array<Date>,
  show: false,
  years: [] as Array<string>,
  months: [] as Array<string>,
  days: [] as Array<string>,
  hours: [] as Array<string>,
  minutes: [] as Array<string>,
  seconds: [] as Array<string>,
});
const startDate = computed(() => {
  const date = new Date(props.startTime);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours();
  const mintue = date.getMinutes();
  return {
    date,
    year,
    month,
    day,
    hour,
    mintue,
  };
});
const endDate = computed(() => {
  const date = new Date(props.endTime);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours();
  const mintue = date.getMinutes();
  return {
    date,
    year,
    month,
    day,
    hour,
    mintue,
  };
});
const lastDateIndex = computed(() => state.date.length - 1);
const lastHourIndex = computed(() => state.hours.length - 1);
const modelValueDate = computed(() => {
  let date;
  if (props.modelValue) {
    date = new Date(props.modelValue);
  } else {
    date = new Date(props.startTime);
  }
  return date;
});

onMounted(() => {
  initData();
});

/**
 * @description: 初始化每一列的数据
 */
const initData = () => {
  // 年月日数据
  if (props.date) {
    const startYear = startDate.value.year;
    const endYear = endDate.value.year;
    // 获取从开始时间到结束时间的所有年份
    state.years = generateArray(startYear, endYear, (index) =>
      index.toString()
    );
    // 获取结束时间的年份
    const lastYear = state.years[state.years.length - 1];
    // 获取开始时间的月份
    const startMonth = startDate.value.month;
    // 获取开始时间的日
    const startDay = startDate.value.day;
    // 获取结束时间的月份
    const lastMonth = endDate.value.month;
    // 获取结束时间的日
    const lastDay = endDate.value.day;
    let monthRange = MONTH_RANGE;
    let dayRange = DAY_RANGE;
    // 获取从开始时间到截止时间的所有年月日数据
    state.years.forEach((year, index) => {
      let sliceMonthStartIndex = 0;
      let sliceMonthEndIndex = MONTH_RANGE.length;
      // 是否是开始时间的年份
      if (index === 0) {
        sliceMonthStartIndex = startMonth - 1;
      }
      // 是否是结束时间的最后一个年
      if (year === lastYear) {
        sliceMonthEndIndex = lastMonth;
      }
      // 截掉范围内的月份
      monthRange = MONTH_RANGE.slice(sliceMonthStartIndex, sliceMonthEndIndex);
      monthRange.forEach((month, index) => {
        let sliceDayStartIndex = 0;
        let sliceDayEndIndex = DAY_RANGE.length;
        // 是否是开始时间所在月份
        if (index === 0 && month === startMonth.toString()) {
          sliceDayStartIndex = startDay - 1;
        }
        // 是否是结束时间的最后一个月
        if (year === lastYear && month === lastMonth.toString()) {
          // 截掉超出的日
          sliceDayEndIndex = lastDay;
        } else {
          if (["01", "03", "05", "07", "08", "10", "12"].includes(month)) {
            // 1,3,5,7,8,10,12 月份为31天
          } else if (["04", "06", "09", "11"].includes(month)) {
            // 4,6,9,11 月份为 30 天
            sliceDayEndIndex = sliceDayEndIndex - 1;
          } else {
            // 2 月份 非闰年为 28 天，闰年为 29 天
            const parseIntYear = parseInt(year);
            // 是否为闰年
            if (
              parseIntYear % 400 === 0 ||
              (parseIntYear % 4 === 0 && parseIntYear % 100 !== 0)
            ) {
              // 闰年 29 天
              sliceDayEndIndex = sliceDayEndIndex - 2;
            } else {
              // 非闰年 28 天
              sliceDayEndIndex = sliceDayEndIndex - 3;
            }
          }
        }
        dayRange = DAY_RANGE.slice(sliceDayStartIndex, sliceDayEndIndex);
        dayRange.forEach((day) => {
          state.date.push({
            year,
            month,
            day,
          });
        });
      });
    });
    state.hours = HOUR_RANGE;
    state.minutes = MINUTE_RANGE;
  }
  // 时分数据
  if (props.time) {
    state.hours = HOUR_RANGE;
    state.minutes = MINUTE_RANGE;
  }
};

/**
 * @description: 初始化选择器选中位置
 */
const initSelectorPosition = () => {
  if (modelValueDate.value) {
    const year = modelValueDate.value.getFullYear().toString();
    let month = (modelValueDate.value.getMonth() + 1).toString();
    let day = modelValueDate.value.getDate().toString();
    let hour = modelValueDate.value.getHours().toString();
    let minute = modelValueDate.value.getMinutes().toString();

    // 格式化时间
    if (parseInt(month) < 10) month = "0" + month;
    if (parseInt(day) < 10) day = "0" + day;
    if (parseInt(hour) < 10) hour = "0" + hour;
    if (parseInt(minute) < 10) minute = "0" + minute;

    // 年月日
    let dateIndex = 0;
    // 时
    let hourIndex = 0;
    // 分
    let minuteIndex = 0;
    // modelValue在起止时间范围内则查找初始索引
    if (
      modelValueDate.value.getTime() < props.endTime &&
      modelValueDate.value.getTime() > props.startTime
    ) {
      dateIndex = state.date.findIndex(
        (item) => item.year === year && item.month === month && item.day === day
      );
      hourIndex = state.hours.findIndex((item) => item === hour);
      minuteIndex = state.minutes.findIndex((item) => item === minute);
    }

    if (props.time && props.date) {
      // 日期时间选择器
      // 如果选择开始年月日，则计算小时选择器范围
      if (dateIndex === 0) {
        state.hours = HOUR_RANGE.slice(startDate.value.hour);
        // 如果选择开始小时，则计算分钟选择器范围
        if (hourIndex === 0) {
          state.minutes = MINUTE_RANGE.slice(startDate.value.mintue);
        }
      }
      // 如果选择结束年月日，则计算小时选择器范围
      if (dateIndex === lastDateIndex.value) {
        state.hours = HOUR_RANGE.slice(0, endDate.value.hour + 1);
        // 如果选择结束小时，则计算分钟选择器范围
        if (hourIndex === lastHourIndex.value) {
          state.minutes = MINUTE_RANGE.slice(0, endDate.value.mintue + 1);
        }
      }
      state.initSelectedIndexs = [dateIndex, hourIndex, minuteIndex];
    } else if (props.time) {
      // 时间选择器
      // 如果选择开始小时，则计算分钟选择器范围
      if (hourIndex === 0) {
        state.minutes = MINUTE_RANGE.slice(startDate.value.mintue);
      }
      // 如果选择结束小时，则计算分钟选择器范围
      if (hourIndex === lastHourIndex.value) {
        state.minutes = MINUTE_RANGE.slice(0, endDate.value.mintue + 1);
      }
      state.initSelectedIndexs = [hourIndex, minuteIndex];
    } else if (props.date) {
      // 日期选择器
      state.initSelectedIndexs = [dateIndex];
    }
  } else {
    state.initSelectedIndexs = [0, 0, 0];
  }
  state.selectedIndexs = state.initSelectedIndexs;
};

const showPopup = () => {
  state.show = true;
  initSelectorPosition();
};

const hidePopup = () => {
  state.show = false;
};

const formatDate = (date: Date) => {
  const { year, month, day } = date;
  return `${parseInt(year) % 100}年${month}月${day}日`;
};

// 选择器选择时，计算下一列选择器的范围
const change = (e) => {
  state.selectedIndexs = e.detail.value;
  const value = e.detail.value;
  console.log(value);

  if (props.date && props.time) {
    // 日期时间选择器
    let sliceHourStartIndex = 0;
    let sliceHourEndIndex = HOUR_RANGE.length;
    let sliceMinuteStartIndex = 0;
    let sliceMinuteEndIndex = MINUTE_RANGE.length;
    // 年月日是否选择了第一个
    if (value[0] === 0) {
      // 确定小时选择器范围
      sliceHourStartIndex = startDate.value.hour;
      // 是否选择了开始时间的第一个小时 确定分钟选择器的范围
      if (value[1] === 0) {
        const startMinute = startDate.value.mintue;
        sliceMinuteStartIndex = startMinute;
      }
    }
    // 年月日是否选择了最后一个
    if (value[0] === lastDateIndex.value) {
      // 确定小时选择器范围
      const endHour = endDate.value.hour;
      sliceHourEndIndex = endHour + 1;

      // 是否选择了开始时间的最后一个小时 确定分钟选择器的范围
      if (value[1] === lastHourIndex.value) {
        const endMinute = endDate.value.mintue;
        sliceMinuteEndIndex = endMinute + 1;
      }
    }
    state.hours = HOUR_RANGE.slice(sliceHourStartIndex, sliceHourEndIndex);
    state.minutes = MINUTE_RANGE.slice(
      sliceMinuteStartIndex,
      sliceMinuteEndIndex
    );
  } else if (props.time) {
    // 时间选择器
    let sliceMinuteStartIndex = 0;
    let sliceMinuteEndIndex = MINUTE_RANGE.length;
    if (value[0] === lastHourIndex.value) {
      const endMinute = endDate.value.mintue;
      sliceMinuteEndIndex = endMinute + 1;
    }
    state.minutes = MINUTE_RANGE.slice(
      sliceMinuteStartIndex,
      sliceMinuteEndIndex
    );
  }
};

/**
 * @description: 确定选择时间
 */
const confirm = () => {
  let selectedDate = "";
  if (props.time && props.date) {
    // 日期时间选择器
    const [dateIndex, hourIndex, minuteIndex] = state.selectedIndexs;
    const date = state.date[dateIndex];
    let { year, month, day } = date;
    const hour = state.hours[hourIndex];
    const minute = state.minutes[minuteIndex];

    selectedDate = `${year}-${month}-${day} ${hour}:${minute}`;
  } else if (props.time) {
    // 时间选择器
    const [hourIndex, minuteIndex] = state.selectedIndexs;
    const hour = state.hours[hourIndex];
    const minute = state.minutes[minuteIndex];

    selectedDate = `${hour}:${minute}`;
  } else if (props.date) {
    // 日期选择器
    const [dateIndex] = state.selectedIndexs;
    const date = state.date[dateIndex];
    let { year, month, day } = date;

    selectedDate = `${year}-${month}-${day}`;
  }
  emit("update:modelValue", selectedDate);
  // emit("confirm", selectedDate);
  hidePopup();
};
</script>

<style scoped lang="less">
.input {
  border: 1px solid @my-color-primary;
  border-radius: 0.5rem;
  height: 2rem;
  line-height: 2rem;
  padding-left: 0.8rem;
  .placeholder {
    color: @my-text-color-grey;
  }
}
.popup {
  .handle {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20rpx;
    .cancel {
      color: @my-text-color-grey;
    }
    .confirm {
      color: @my-color-primary;
    }
  }
  .picker-view {
    height: 100%;
    .picker-view-column {
      text-align: center;
      .item {
        display: flex;
        justify-content: center;
        align-items: center;
        color: @my-color-primary;
      }
    }
  }
}
</style>
