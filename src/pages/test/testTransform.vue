<template>
  <page-meta
    :page-style="'overflow:' + (show ? 'hidden' : 'visible')"
  ></page-meta>
  <div>
    <button @click="show = !show">点击</button>
    <MyPopup :show="show" @hide="show = false" position="bottom"></MyPopup>
  </div>
</template>

<script setup lang="ts">
import { watch } from "vue";
import { ref } from "vue";

const show = ref(false);

watch(show, (newV) => {
  if (newV) {
    document.body.style.background = "#000";
    const app = document.querySelector("#app") as HTMLElement;
    if (app) {
      app.style.height = "200vh";
      app.style.background = "#fff";
      app.style.transition = "all .5s linear";
      app.style.transform = "scale(0.97, 0.98)";
    }
  }
});
</script>
