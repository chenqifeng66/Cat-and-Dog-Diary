<template>
  <div class="card-group">
    <div
      class="card"
      v-for="item in card"
      :key="item.name"
      @click="goto(item.url)"
    >
      <image class="icon" :src="'../../static/' + item.icon" />
      <div class="name">{{ item.name }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
const card = [
  {
    name: "待办事项",
    icon: "todo.svg",
    url: "/pages/todo/todo",
  },
  {
    name: "日历提醒",
    icon: "calendar.svg",
    url: "/pages/calendar/calendar",
  },
  {
    name: "贪吃蛇",
    icon: "snake.svg",
    url: "/pages/greedySnake/greedySnake",
  },
];

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
    margin: 0 0.3rem 0.3rem 0;
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
