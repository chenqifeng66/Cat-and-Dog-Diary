<template>
  <button @click="goto('/pages/index/index')">待办事项</button>
  <button @click="goto('/pages/calendar/calendar')">日历提醒</button>
</template>

<script setup>
function goto(url) {
  uni.navigateTo({
    url: url,
  });
}
</script>
