<template>
  <div class="container">
    <div
      class="body-item"
      :style="{
        left: state.snake.x * BASE_SIZE + 'rem',
        top: state.snake.y * BASE_SIZE + 'rem',
      }"
    ></div>
    <div
      class="body-item"
      v-for="(item, index) in state.snakeBody"
      :key="index"
      :style="{
        left: item.x * BASE_SIZE + 'rem',
        top: item.y * BASE_SIZE + 'rem',
      }"
    ></div>
    <div
      class="food"
      :style="{
        left: state.food.x * BASE_SIZE + 'rem',
        top: state.food.y * BASE_SIZE + 'rem',
      }"
    ></div>
  </div>
  <div class="control">
    <div class="key-group">
      <div class="key" @click="turn('up')">↑</div>
    </div>
    <div class="key-group">
      <div class="key" @click="turn('left')">←</div>
      <div class="key" @click="turn('down')">↓</div>
      <div class="key" @click="turn('right')">→</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { watchEffect, watch } from "vue";
import { reactive } from "vue";
import { onMounted } from "vue";

const BASE_SIZE = 1;
let timer: NodeJS.Timeout;
const state = reactive({
  snake: {
    x: 10,
    y: 12,
  },
  snakeBody: [
    {
      x: 11,
      y: 12,
    },
  ],
  food: {
    x: 3,
    y: 4,
  },
  direction: "up",
  speed: 800,
});

onMounted(() => {});

watchEffect(() => {
  if (state.snake.x === state.food.x && state.snake.y === state.food.y) {
    eatFood();
  }
});

// watchEffect(() => {
//   if (
//     state.snake.x < 0 ||
//     state.snake.x > 19 ||
//     state.snake.y < 0 ||
//     state.snake.y > 24
//   ) {
//     clearInterval(timer);
//     alert("游戏结束");
//   }
// });

// watch(
//   () => state.snake,
//   (newVal, oldVal) => {
//     console.log(oldVal.x === newVal.x);

//     console.log("new", newVal);
//     console.log("old", oldVal);

//     state.snakeBody.forEach((item, index, arr) => {
//       item.x = oldVal.x;
//       item.y = oldVal.y;
//       // if (index === 0) {
//       //   item.y = oldVal;
//       // } else {
//       //   item.y = arr[index - 1].y;
//       // }
//     });
//   },
//   { deep: true }
// );

// watch(
//   () => state.snake.y,
//   (newVal, oldVal) => {
//     if (newVal < 0) {
//       clearInterval(timer);
//       newVal = oldVal;
//     }
//     state.snakeBody.forEach((item, index, arr) => {
//       if (index === 0) {
//         item.y = oldVal;
//       } else {
//         item.y = arr[index - 1].y;
//       }
//     });
//   }
// );
// watch(
//   () => state.snake.x,
//   (newVal, oldVal) => {
//     if (newVal < 0) {
//       clearInterval(timer);
//       newVal = oldVal;
//     }
//     state.snakeBody.forEach((item, index, arr) => {
//       if (index === 0) {
//         item.x = oldVal;
//       } else {
//         item.x = arr[index - 1].x;
//       }
//     });
//   }
// );

/**
 * @description: 移动蛇头
 */
function move() {
  clearInterval(timer);
  switch (state.direction) {
    case "right":
      timer = setInterval(() => {
        state.snake.x++;
      }, state.speed);
      break;
    case "left":
      timer = setInterval(() => {
        state.snake.x--;
      }, state.speed);
      break;
    case "up":
      timer = setInterval(() => {
        state.snake.y--;
      }, state.speed);
      break;
    case "down":
      timer = setInterval(() => {
        state.snake.y++;
      }, state.speed);
      break;
  }
  setInterval(() => {
    state.snakeBody.forEach((item, index, arr) => {
      if (index === 0) {
        item.x = state.snake.x;
        item.y = state.snake.y;
      } else {
        item.x = arr[index - 1].x;
        item.y = arr[index - 1].y;
      }
    });
  }, state.speed);
}

/**
 * @description: 转向
 * @param {*} direction
 */
function turn(direction: string) {
  if (direction === state.direction) return;
  state.direction = direction;
  move();
}

/**
 * @description: 吃食物
 */
function eatFood() {
  state.food.x = Math.floor(Math.random() * 20);
  state.food.y = Math.floor(Math.random() * 25);
}
</script>

<style lang="less" scoped>
.container {
  --base-size: 1rem;

  width: 20rem;
  height: 25rem;
  border: 1px solid #fff;
  margin: 0 auto;
  background-color: var(--theme-color);
  position: relative;

  .food {
    height: var(--base-size);
    width: var(--base-size);
    border-radius: 50%;
    background-color: var(--font-color);
    position: absolute;
  }
  .body-item {
    height: var(--base-size);
    width: var(--base-size);
    background-color: var(--font-color);
    position: absolute;
  }
}

.control {
  position: fixed;
  bottom: 5rem;
  left: 50%;
  transform: translateX(-50%);
  .key-group {
    display: flex;
    justify-content: center;
    margin-bottom: 0.2rem;
    .key {
      height: 3rem;
      width: 3rem;
      background-color: var(--theme-color);
      color: var(--font-color);
      border-radius: 0.3rem;
      margin-right: 0.2rem;
      display: flex;
      justify-content: center;
      align-items: center;
      font-weight: bold;
    }
  }
}
</style>
