<template>
  <view>
    <button @click="show">show</button>
    <picker-view v-if="showPicker" style="height: 400rpx">
      <picker-view-column>
        <view class="item" v-for="(dom, index) in state.doms" :key="index">{{
          dom.year + "年" + dom.month + "月" + dom.day + "日"
        }}</view>
      </picker-view-column>
    </picker-view>
  </view>
</template>

<script setup>
import { onMounted, onUnmounted, reactive, ref } from "vue";

const showPicker = ref(false);
const state = reactive({
  data: [],
  doms: [],
});

onMounted(() => {
  getData();
});

const getData = () => {
  for (let i = 0; i < 10000; i++) {
    state.data.push({
      year: i,
      month: i,
      day: i,
    });
  }
};

const defer = (reqData, renderData, onceRenderCount) => {
  if (!reqData.length) return;

  let startIndex = 0;
  let endIndex = onceRenderCount;

  let id = requestAnimationFrame(render);

  function render() {
    const newRenderData = reqData.slice(startIndex, endIndex);
    renderData.push(...newRenderData);
    startIndex = endIndex;
    endIndex += onceRenderCount;
    if (renderData.length === reqData.length) {
      cancelAnimationFrame(id);
    } else {
      requestAnimationFrame(render);
    }
  }
};

const show = () => {
  showPicker.value = true;
  defer(state.data, state.doms, 20);
};

// const defer = useDefer();
</script>
