<template>
  <div class="card-group">
    <div class="card" @click="goto('/pages/todo/todo')">
      <image class="icon" src="@/static/todo.svg" />
      <div class="name">待办事项</div>
    </div>
    <div class="card" @click="goto('/pages/calendar/calendar')">
      <image class="icon" src="@/static/calendar.svg" />
      <div class="name">日历提醒</div>
    </div>
    <div class="card" @click="goto('/pages/greedySnake/greedySnake')">
      <image class="icon" src="@/static/snake.svg" />
      <div class="name">贪吃蛇</div>
    </div>
  </div>
</template>

<script setup lang="ts">
function goto(url: string) {
  uni.navigateTo({
    url: url,
  });
}
</script>

<style lang="less">
.card-group {
  display: flex;
  margin: 1rem;
  flex-wrap: wrap;
  .card {
    height: 6.8rem;
    width: 5rem;
    background-color: #000;
    border-radius: 1rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    color: #fff;
    margin-right: 0.5rem;
    .icon {
      width: 3rem;
      height: 3rem;
      margin-bottom: 0.5rem;
    }
    .name {
      font-weight: bold;
      font-size: 0.7rem;
    }
  }
}
</style>
