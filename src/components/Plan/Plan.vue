<template>
  <view class="plan-list">
    <view class="top">
      <text class="title">计划</text>
      <text class="handle" @click="showPopup">新增</text>
    </view>

    <!-- 计划列表 -->
    <template v-if="state.dataList.length">
      <view
        v-for="(plan, index) in state.dataList"
        :key="plan.id"
        class="plan"
        :class="{
          complete: plan.isComplete,
        }"
      >
        <view class="time-info">
          <text class="tip">{{
            isTodayPlan(plan.dueTime)
              ? "Today"
              : formatDate(new Date(plan.dueTime), "MM-dd")
          }}</text>
          <text class="time">{{
            formatDate(new Date(plan.dueTime), "hh:mm")
          }}</text>
        </view>

        <movable-area class="movable">
          <movable-view
            class="movable movable-view"
            :class="{
              'one-btn': plan.isComplete,
            }"
            direction="horizontal"
            inertia
            damping="20"
            out-of-bounds
            :x="plan.x"
            @touchstart="touchStart"
            @touchend="touchEnd(index, $event)"
          >
            <view class="info" @click="hideHandle(index)">
              <image class="avatar" src="@/assets/svgs/plan.svg"></image>
              <view class="detail">
                <text class="title">{{ plan.title }}</text>
                <text class="notes">{{ plan.notes }}</text>
              </view>
              <view class="time">
                <text class="number">{{ plan.time }}</text>
                <text class="unit">min</text>
              </view>
            </view>
            <view class="handle">
              <view class="btn delete" @click="deletePlan(plan.id)">
                <image class="icon" src="@/assets/svgs/trash-can.svg"></image
              ></view>
              <view
                v-if="!plan.isComplete"
                class="btn done"
                @click="donePlan(plan.id)"
              >
                <image class="icon" src="@/assets/svgs/done.svg"></image>
              </view>
            </view>
          </movable-view>
        </movable-area>
      </view>
    </template>
    <!-- 无计划时显示 -->
    <template v-else>
      <view class="empty">空空如也~</view>
    </template>

    <!-- 新增计划 -->
    <MyPopup :show="state.isShowPopup" @hide="hidePopup">
      <view class="popup">
        <view class="title">新增计划</view>
        <view class="form">
          <MyForm :model="state.newPlan" :rules="rules" ref="myForm">
            <MyFormItem label="标题" prop="title"
              ><MyInput maxlength="10" v-model="state.newPlan.title" />
            </MyFormItem>
            <MyFormItem label="开始时间" prop="dueTime"
              ><MyDateTimePicker
                v-model="state.newPlan.dueTime"
                time
                :startTime="state.startTime"
                :endTime="state.endTime"
              ></MyDateTimePicker>
            </MyFormItem>
            <MyFormItem label="用时(分钟)" prop="time"
              ><MyInput
                maxlength="10"
                type="number"
                v-model.number="state.newPlan.time"
              />
            </MyFormItem>
            <MyFormItem label="备注"
              ><MyInput maxlength="20" v-model="state.newPlan.notes" />
            </MyFormItem>
            <button class="submit" @click="handleNewPlanSubmit">完成</button>
          </MyForm>
        </view>
      </view>
    </MyPopup>
  </view>
</template>

<script setup lang="ts">
import { reactive, watch, ref } from "vue";
import { Plan } from "@/types/plan";
import { formatDate } from "@/utils/methods";

interface PlanMovableView extends Plan {
  x: number;
}

const emit = defineEmits(["add", "delete", "done"]);
const props = defineProps({
  data: {
    type: Array<Plan>,
    default: () => [],
  },
});

const myForm: any = ref(null);
const state = reactive({
  dataList: [] as Array<PlanMovableView>,
  offset: 10,
  currentTouchX: 0,
  isShowPopup: false,
  newPlan: {} as Plan,
  startTime: Date.now(),
  endTime: Date.now() + 1000 * 3600 * 24 * 180,
});
const rules = {
  title: [
    {
      required: true,
      message: "请输入标题",
    },
  ],
  dueTime: [
    {
      required: true,
      message: "请输入开始时间",
    },
  ],
  time: [
    {
      required: true,
      message: "请输入用时",
    },
  ],
};

watch(
  () => props.data,
  (newVal) => {
    // 给每个计划添加 x 参数，控制滑动位置
    const dataList = newVal.map((item) => {
      return { ...item, x: 0 } as PlanMovableView;
    });
    // 已完成的计划
    const completeds = dataList.filter((item) => item.isComplete);
    // 未完成的计划
    const inCompleteds = dataList.filter((item) => !item.isComplete);
    // 对开始时间进行排序
    completeds.sort((a, b) => Date.parse(b.dueTime) - Date.parse(a.dueTime));
    inCompleteds.sort((a, b) => Date.parse(b.dueTime) - Date.parse(a.dueTime));
    // 以未完成在前，已完成在后的组合
    state.dataList = inCompleteds.concat(completeds);
  },
  { immediate: true, deep: true }
);

function touchStart(e: any) {
  const { clientX } = e.changedTouches[0];
  state.currentTouchX = clientX;
}

function touchEnd(index: number, e: any) {
  const { clientX } = e.changedTouches[0];

  // 左滑
  if (state.currentTouchX - clientX > state.offset) {
    state.dataList = state.dataList.map((item, i) => {
      if (i !== index) {
        item.x = 0;
      } else {
        item.x = -999;
      }
      return item;
    });
  } else if (clientX - state.currentTouchX > state.offset) {
    // 右滑
    state.dataList[index].x = 0;
  }
}

function hideHandle(index: number) {
  state.dataList[index].x = 0;
}

function deletePlan(id: string) {
  emit("delete", id);
}

function donePlan(id: string) {
  emit("done", id);
}

function showPopup() {
  state.newPlan = {
    id: "",
    avatar: "",
    title: "",
    time: 10,
    dueTime: formatDate(new Date(), "yyyy-MM-dd hh:mm"),
    notes: "",
    isComplete: false,
  };
  state.isShowPopup = true;
}

function hidePopup() {
  state.isShowPopup = false;
}

function handleNewPlanSubmit() {
  myForm.value.validate((valid: boolean) => {
    if (valid) {
      emit("add", state.newPlan);
      hidePopup();
    }
  });
}

/**
 * @description: 是否是今天的计划
 * @return {boolean}
 */
const isTodayPlan = (dueTime: string) => {
  return new Date(dueTime).getDate() === new Date().getDate();
};
</script>

<style lang="less" scoped>
.plan-list {
  margin: 0 1.5rem;

  .top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.8rem;
    .title {
      font-weight: bold;
      font-size: 1.1rem;
    }
    .handle {
      color: @my-color-primary;
      font-size: 0.8rem;
    }
  }

  .empty {
    height: 200rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    color: @my-color-primary;
    opacity: 0.5;
    font-size: 25rpx;
  }

  .plan {
    display: flex;
    justify-content: space-between;
    margin-bottom: 0.5rem;

    &.complete {
      opacity: 0.5;
    }

    .movable {
      width: 99vw;
      height: 3.8rem;
      overflow: hidden;
      margin-left: 1rem;

      &.one-btn {
        width: 87vw;
      }
    }
    .movable-view {
      display: flex;
    }

    .time-info {
      display: flex;
      flex-direction: column;
      .tip {
        color: @my-text-color-grey;
        font-size: 0.8rem;
      }
      .time {
        font-weight: bold;
      }
    }

    .info {
      height: 3.8rem;
      flex: 1;
      background: #fff;
      border-radius: 1rem;
      margin-right: 0.8rem;
      padding: 0.5rem;
      box-sizing: border-box;
      display: flex;
      align-items: center;

      .avatar {
        height: 2rem;
        width: 2rem;
        border-radius: 0.6rem;
      }

      .detail {
        display: flex;
        flex-direction: column;
        flex: 1;
        margin: 0 0.8rem;
        .title {
          font-weight: bold;
        }
        .notes {
          font-size: 0.8rem;
          color: @my-text-color-grey;
        }
      }

      .time {
        display: flex;
        flex-direction: column;
        align-items: flex-end;

        .number {
          font-weight: bold;
          font-size: 1.2rem;
        }
        .unit {
          color: @my-text-color-grey;
          font-size: 0.6rem;
        }
      }
    }
    .handle {
      display: flex;
      align-items: center;

      .btn {
        width: 2.5rem;
        height: 2.5rem;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 0.8rem;
        margin-right: 0.3rem;

        .icon {
          width: 60%;
          height: 60%;
        }
      }
      .delete {
        background: @my-color-error;
      }
      .done {
        background: @my-color-primary;
      }
    }
  }
}

.popup {
  width: 60vw;
  .title {
    font-weight: bold;
    font-size: 1.2rem;
    color: @my-color-primary;
    margin-bottom: 1rem;
  }
  .submit {
    background: @my-color-primary;
    color: #fff;
    font-size: 1rem;
    border-radius: 0.8rem;
    margin-top: 2rem;
    &::after {
      border: none;
    }
  }
}
</style>
