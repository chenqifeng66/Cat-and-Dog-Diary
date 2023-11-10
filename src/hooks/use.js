import { ref, onUnmounted } from "vue";

export const useDefer = (maxCount = 1000) => {
  const frameCount = ref(0);
  let id;
  function updateFrameCount() {
    id = requestAnimationFrame(() => {
      console.log(frameCount.value);
      if (frameCount.value >= maxCount) {
        console.log("结束");
      } else {
        frameCount.value++;
        updateFrameCount();
      }
    });
  }
  updateFrameCount();
  onUnmounted(() => {
    cancelAnimationFrame(id);
  });
  return function defer(n) {
    console.log("执行了defer函数");
    return frameCount.value > n;
  };
};
