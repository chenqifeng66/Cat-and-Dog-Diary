<template>
  <div class="stage">
    <template v-if="!state.isGameOver">
      <div
        class="head body-item"
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
    </template>
    <div v-else class="game-over">GAME OVER</div>
  </div>

  <div class="handle">
    <div class="score">分数：{{ state.score }}</div>
    <div class="btn" @click="init">
      <image class="icon" src="@/static/reset.svg" />
      <div>重新开始</div>
    </div>
  </div>

  <!-- 操作按键 -->
  <div class="control">
    <div class="key-group">
      <div class="key" @click="turn('up')">
        <image class="icon" src="@/static/key_up.svg" />
      </div>
    </div>
    <div class="key-group">
      <div class="key" @click="turn('left')">
        <image class="icon" src="@/static/key_left.svg" />
      </div>
      <div class="key" @click="turn('down')">
        <image class="icon" src="@/static/key_down.svg" />
      </div>
      <div class="key" @click="turn('right')">
        <image class="icon" src="@/static/key_right.svg" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { watchEffect } from "vue";
import { reactive } from "vue";
import { onMounted } from "vue";

// 蛇、食物、舞台基本单位：BASE_SIZE * rem
const BASE_SIZE = 1;
// 舞台宽度
const STAGE_WIDTH = 20;
// 舞台高度
const STAGE_HEIGHT = 25;
let timer: NodeJS.Timeout;
interface Position {
  x: number;
  y: number;
}
const state = reactive({
  snake: {} as Position,
  snakeBody: [] as Array<Position>,
  food: {} as Position,
  direction: "", // up down right left
  speed: 300,
  isGameOver: false,
  score: 0,
});

onMounted(() => {
  init();
});

watchEffect(() => {
  if (state.snake.x === state.food.x && state.snake.y === state.food.y) {
    eatFood();
    addBody();
    if (state.speed > 40) {
      state.speed = state.speed - 20;
      move();
    }
  }
});

function init() {
  state.isGameOver = false;
  state.food = { x: 3, y: 4 };
  state.snake = { x: 10, y: 12 };
  state.snakeBody = [];
  state.direction = "";
  state.score = 0;
  clearInterval(timer);
}

/**
 * @description: 移动蛇头
 */
function move(): void {
  clearInterval(timer);
  switch (state.direction) {
    case "right":
      moveSnake(() => {
        if (isCollided({ x: state.snake.x + 1 })) {
          clearInterval(timer);
          state.isGameOver = true;
        } else {
          bodyMove();
          state.snake.x++;
        }
      });
      break;
    case "left":
      moveSnake(() => {
        if (isCollided({ x: state.snake.x - 1 })) {
          clearInterval(timer);
          state.isGameOver = true;
        } else {
          bodyMove();
          state.snake.x--;
        }
      });
      break;
    case "up":
      moveSnake(() => {
        if (isCollided({ y: state.snake.y - 1 })) {
          clearInterval(timer);
          state.isGameOver = true;
        } else {
          bodyMove();
          state.snake.y--;
        }
      });
      break;
    case "down":
      moveSnake(() => {
        if (isCollided({ y: state.snake.y + 1 })) {
          clearInterval(timer);
          state.isGameOver = true;
        } else {
          bodyMove();
          state.snake.y++;
        }
      });
      break;
  }
}

function moveSnake(cb: any) {
  if (cb) {
    timer = setInterval(cb, state.speed);
  }
}

/**
 * @description: 移动蛇身
 */
function bodyMove(): void {
  for (let i = state.snakeBody.length - 1; i >= 0; i--) {
    if (i === 0) {
      state.snakeBody[i].x = state.snake.x;
      state.snakeBody[i].y = state.snake.y;
    } else {
      state.snakeBody[i].x = state.snakeBody[i - 1].x;
      state.snakeBody[i].y = state.snakeBody[i - 1].y;
    }
  }
}

/**
 * @description: 转向
 * @param {*} direction
 */
function turn(direction: string): void {
  if (state.isGameOver) return;
  if (direction === state.direction) return;
  wx.vibrateShort({ type: "medium" });
  state.direction = direction;
  move();
}

/**
 * @description: 吃食物
 */
function eatFood(): void {
  state.score += 100;
  state.food.x = Math.floor(Math.random() * STAGE_WIDTH);
  state.food.y = Math.floor(Math.random() * STAGE_HEIGHT);
}

/**
 * @description: 增加身体
 */
function addBody(): void {
  const length = state.snakeBody.length;
  if (length) {
    state.snakeBody.push({
      x: state.snakeBody[length - 1].x,
      y: state.snakeBody[length - 1].y,
    });
  } else {
    state.snakeBody.push({
      x: state.snake.x,
      y: state.snake.y,
    });
  }
}

/**
 * @description: 是否碰撞
 * @param {number} x 下一个位置的横坐标
 * @param {number} y 下一个位置的纵坐标
 * @return {boolean}
 */
function isCollided({ x = state.snake.x, y = state.snake.y }): boolean {
  if (x < 0 || x > STAGE_WIDTH - 1 || y < 0 || y > STAGE_HEIGHT - 1) {
    return true;
  }
  state.snakeBody.forEach((item) => {
    if (item.x === x && item.y === y) return true;
  });
  return false;
}
</script>

<style lang="less" scoped>
.stage {
  --base-size: calc(v-bind(BASE_SIZE) * 1rem);

  width: calc(var(--base-size) * v-bind(STAGE_WIDTH));
  height: calc(var(--base-size) * v-bind(STAGE_HEIGHT));
  border: 2px solid #fff;
  margin: 1rem auto;
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
    z-index: 1;
  }
  .game-over {
    color: var(--font-color);
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    font-size: 2.5rem;
    width: 100%;
    font-weight: bold;
    text-align: center;
    z-index: 6;
  }
}

.handle {
  --base-size: calc(v-bind(BASE_SIZE) * 1rem);

  display: flex;
  justify-content: space-between;
  align-items: center;
  width: calc(var(--base-size) * v-bind(STAGE_WIDTH));
  margin: 1rem auto;
  color: var(--font-color);
  font-weight: bold;
  .score {
    font-size: 1.1rem;
    flex: 1;
  }
  .btn {
    height: 2rem;
    width: 6rem;
    display: flex;
    justify-content: center;
    align-items: center;
    border: 1px solid var(--font-color);
    border-radius: 0.2rem;
    .icon {
      height: 1rem;
      width: 1rem;
      margin-right: 0.2rem;
    }
  }
}

.control {
  position: fixed;
  bottom: 5%;
  left: 50%;
  transform: translateX(-50%);
  .key-group {
    display: flex;
    justify-content: center;
    margin-bottom: 0.4rem;
    .key {
      height: 20vw;
      width: 20vw;
      background-color: var(--theme-color);
      color: var(--font-color);
      border-radius: 0.4rem;
      margin-right: 0.4rem;
      display: flex;
      justify-content: center;
      align-items: center;
      font-weight: bold;
      box-sizing: border-box;
      &:active {
        border: 1px solid #fff;
      }
      .icon {
        width: 60%;
        height: 60%;
      }
    }
  }
}
</style>
