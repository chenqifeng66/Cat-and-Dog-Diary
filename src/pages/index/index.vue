<template>
  <view class="container">
    <view class="top">
      <view class="title">My Tasks</view>
      <view class="options"></view>
    </view>
    <view class="main">
      <!-- 待办 -->
      <view class="incomplete" v-if="todoList.length">
        <view class="title">待办</view>
        <view class="todo-list" ref="todoListRef">
          <view
            :class="{
              'todo-leave': !delHandle.isCompleted && delHandle.index == index,
              'todo-up':
                !delHandle.isCompleted &&
                delHandle.index != -1 &&
                index > delHandle.index,
            }"
            class="todo"
            v-for="(item, index) in todoList"
            :key="item.id"
            @click="finished(index)"
          >
            <view class="checkbox"></view>
            <view class="content">{{ item.content }}</view>
            <image
              class="svg"
              :src="svg_top"
              :class="{ 'svg-disable': index == 0 }"
              @click.stop="topTodo(index)"
            ></image>
            <image
              class="svg"
              :src="svg_clear"
              @click.stop="delTodo(index, $event)"
            ></image>
          </view>
        </view>
      </view>
      <!-- 已完成 -->
      <view
        class="completed"
        v-if="completedList.length"
        :class="{
          'todo-up': !delHandle.isCompleted && delHandle.index != -1,
        }"
      >
        <view class="title">已完成</view>
        <view class="todo-list">
          <view
            :class="{
              'todo-leave': delHandle.isCompleted && delHandle.index == index,
              'todo-up':
                delHandle.isCompleted &&
                delHandle.index != -1 &&
                index > delHandle.index,
            }"
            class="todo"
            v-for="(item, index) in completedList"
            :key="item.id"
          >
            <view class="checkbox"></view>
            <view class="content">{{ item.content }}</view>
            <image
              class="svg"
              :src="svg_restore"
              @click.stop="restoreTodo(index)"
            ></image>
            <image
              class="svg"
              :src="svg_clear"
              @click.stop="delComputed(index)"
            ></image>
          </view>
        </view>
      </view>
    </view>
    <view class="add" @click="showInput = true">+</view>
    <button open-type="openSetting">打开授权设置</button>
    <button @click="addTestCalendar">添加测试日历</button>
    <view class="add-modal" v-if="showInput">
      <textarea
        class="add-input"
        v-model="todo.content"
        auto-focus
        fixed
        :show-confirm-bar="false"
        confirm-type="done"
        placeholder="输入待办事项"
        placeholder-style="color:#94adcf"
        @confirm="addTodo"
      />

      <button class="add-button" @click="addTodo">Add</button>
    </view>

    <view class="overlay" v-show="showInput" @click="showInput = false"></view>
    <view class="tip" v-if="empty"> <image :src="svg_empty"></image></view>
  </view>
</template>

<script setup>
import { onMounted, reactive, computed, ref } from "vue";
// import "react-native-get-random-values";
// import { v4 as uuidv4 } from "uuid";
import svg_clear from "@/static/clear.svg";
import svg_empty from "@/static/empty.svg";
import svg_top from "@/static/top.svg";
import svg_restore from "@/static/restore.svg";
import { nextTick } from "vue";
import { watch } from "vue";

const todoList = reactive([]);
const completedList = reactive([]);
const todo = reactive({
  id: "",
  content: "",
  finished: false,
});
const showInput = ref(false);
const todoListRef = ref(null);
const delHandle = reactive({
  isCompleted: false,
  index: -1,
});
const topIndex = ref(-1);
const upDistance = ref(0);
let todoListNode = [];
let completedListNode = [];

const empty = computed(() => {
  return !todoList.length && !completedList.length ? true : false;
});

watch(todoList, () => {
  nextTick(() => {
    uni
      .createSelectorQuery()
      .selectAll(".incomplete .todo")
      .boundingClientRect((data) => {
        todoListNode = data;
      })
      .exec();
  });
});

watch(completedList, () => {
  nextTick(() => {
    uni
      .createSelectorQuery()
      .selectAll(".completed .todo")
      .boundingClientRect((data) => {
        completedListNode = data;
      })
      .exec();
  });
});

onMounted(() => {
  const todos = uni.getStorageSync("todoList");
  const completeds = uni.getStorageSync("completedList");
  if (todos) todoList.push(...todos);
  if (completeds) completedList.push(...completeds);
  nextTick(() => {
    uni
      .createSelectorQuery()
      .selectAll(".incomplete .todo")
      .boundingClientRect((data) => {
        todoListNode = data;
      })
      .exec();
  });
  wx.getSetting({
    success(res) {
      if (!res.authSetting["scope.addPhoneCalendar"]) {
        wx.authorize({
          scope: "scope.addPhoneCalendar",
          success(res) {},
          fail(err) {
            console.log(err);
          },
        });
      }
    },
  });
});

const topTodo = (index) => {
  const todo = todoList[index];
  todoList.splice(index, 1);
  todoList.unshift(todo);
  save();
};

const addTodo = () => {
  if (!todo.content.trim()) return;
  todo.id = (todoList.length + completedList.length).toString() + "todo";
  todoList.push({ ...todo });
  save();
  showInput.value = false;
  todo.content = "";
};

const finished = (index) => {
  const todo = todoList[index];
  todoList.splice(index, 1);
  completedList.push(todo);
  save();
};

const delTodo = (index, e) => {
  delHandle.isCompleted = false;
  delHandle.index = index;

  // 是否是最后一个元素
  if (index != todoList.length - 1) {
    // 不是 下面的元素上移
    upDistance.value = todoListNode[index + 1].top - todoListNode[index].top;
  }

  setTimeout(() => {
    delHandle.index = -1;
    todoList.splice(index, 1);
    // save();
  }, 500);
};

const delComputed = (index) => {
  delHandle.isCompleted = true;
  delHandle.index = index;

  // 是否是最后一个元素
  if (index != completedList.length - 1) {
    // 不是 下面的元素上移
    upDistance.value =
      completedListNode[index + 1].top - completedListNode[index].top;
  }

  setTimeout(() => {
    delHandle.index = -1;
    completedList.splice(index, 1);
    // save();
  }, 500);
};

const restoreTodo = (index) => {
  const todo = completedList[index];
  completedList.splice(index, 1);
  todoList.push(todo);
  save();
};

const save = () => {
  uni.setStorageSync("todoList", todoList);
  uni.setStorageSync("completedList", completedList);
};
</script>

<style lang="less">
page {
  height: 100%;
  background: #38404b;
}

.svg-disable {
  opacity: 0;
}

.todo-leave {
  transition: all 0.5s;
  transform: translateX(100px);
  opacity: 0;
}

.todo-up {
  transition: all 0.5s;
  transform: translateY(calc(-1px * v-bind(upDistance)));
}

@keyframes openModal {
  from {
    margin-top: 90%;
  }
  to {
    margin-top: 30%;
  }
}
.container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  color: #94adcf;
  padding: 1.5rem;
  box-sizing: border-box;

  .tip {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    image {
      width: 8rem;
    }
  }

  .add {
    position: fixed;
    bottom: 10%;
    right: 10%;
    width: 4rem;
    height: 4rem;
    border-radius: 50%;
    text-align: center;
    line-height: 3.4rem;
    font-size: 3rem;
    background: #38404b;

    box-shadow: 1px 1px 3px rgba(22, 26, 30, 0.9),
      -1px -1px 2px rgba(90, 102, 120, 0.9), 1px -1px 2px rgba(22, 26, 30, 0.2),
      -1px 1px 2px rgba(22, 26, 30, 0.2),
      inset -1px -1px 2px rgba(22, 26, 30, 0.5),
      inset 1px 1px 2px rgba(90, 102, 120, 0.3);
  }

  .overlay {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(3px);
    z-index: 1;
  }

  .add-modal {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
    margin-top: 30%;
    height: 20%;
    width: 60%;
    z-index: 2;
    display: flex;
    flex-direction: column;
    align-items: center;
    animation: 0.3s ease-in 1 openModal;

    .add-input {
      width: 100%;
      height: 5rem;
      padding: 0.2rem;
      border: 2px solid #94adcf;
      border-radius: 0.5rem;
    }
    .add-button {
      width: 100%;
      height: 3rem;
      display: flex;
      justify-content: center;
      align-items: center;
      margin-top: 1rem;
      background: #38404b;
      color: #fff;
      font-weight: 500;
    }
  }

  .top {
    width: 100%;
    display: flex;
    justify-content: space-between;
    font-size: 1.5rem;
    font-weight: 700;
    margin-bottom: 2rem;
    .options {
      position: relative;
      &::after {
        content: "";
        width: 1.5rem;
        height: 0.2rem;
        position: absolute;
        top: 0.5rem;
        right: 0;
        border-radius: 0.2rem;
        background: #94adcf;
        display: block;
        box-shadow: 0 8px 0 0 #94adcf, 0 16px 0 0 #94adcf;
      }
    }
  }

  .main {
    width: 100%;
    .incomplete,
    .completed {
      margin-bottom: 2rem;
      .title {
        font-size: 1rem;
        font-weight: 400;
        margin-bottom: 1.5rem;
      }
      .todo-list {
        margin: 1rem 0;
        .todo {
          width: 100%;
          box-shadow: 2px 2px 4px 0px #303640, -2px -2px 4px 0px #404a56;
          margin: 1rem 0;
          display: flex;
          align-items: center;
          padding: 0.5rem;
          box-sizing: border-box;
          border-radius: 0.8rem;
          font-size: 1.2rem;
          font-weight: 500;
          .checkbox {
            width: 0.5rem;
            height: 0.5rem;
            border: 2px solid #94adcf;
            border-radius: 50%;
            margin: 0 1rem;
          }
          .content {
            flex: 1;
            word-wrap: break-word;
            word-break: break-all;
            letter-spacing: 1px;
          }
          .svg {
            width: 1.2rem;
            height: 1.2rem;
            margin: 0 0.3rem;
          }
        }
      }
    }

    .completed {
      .todo-list {
        .todo {
          .checkbox {
            background: #94adcf;
          }
          .content {
            text-decoration-line: line-through;
          }
          // box-shadow: inset 2px 2px 4px 0px rgba(#303640, 0.9),
          //   inset 2px 2px 4px 0px rgba(#404a56, 0.9),
          //   0px 2px 4px 0px rgba(#303640, 1),
          //   inset 2px 0px 4px 0px rgba(#303640, 0.2);
        }
      }
    }
  }
}
</style>
