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
        <view class="todo-list">
          <view
            class="todo"
            v-for="(item, index) in todoList"
            :key="item.id"
            @click="finished(index)"
          >
            <view class="checkbox"></view>
            <view class="content">{{ item.content }}</view>
            <image
              class="clear"
              :src="svg_clear"
              @click.stop="delTodo(index)"
            ></image>
          </view>
        </view>
      </view>
      <!-- 已完成 -->
      <view class="completed" v-if="completedList.length">
        <view class="title">已完成</view>
        <view class="todo-list">
          <view
            class="todo"
            v-for="(item, index) in completedList"
            :key="item.id"
          >
            <view class="checkbox"></view>
            <view class="content">{{ item.content }}</view>
            <image
              class="clear"
              :src="svg_clear"
              @click.stop="delComputed(index)"
            ></image>
          </view>
        </view>
      </view>
    </view>
    <view class="add" @click="add">+</view>
    <view class="tip" v-if="empty"> <image :src="svg_empty"></image></view>
  </view>
</template>

<script setup>
import { onMounted, reactive, computed } from "vue";
import svg_clear from "@/static/clear.svg";
import svg_empty from "@/static/empty.svg";

const todoList = reactive([]);
const completedList = reactive([]);

const empty = computed(() => {
  return !todoList.length && !completedList.length ? true : false;
});

onMounted(() => {
  const todos = uni.getStorageSync("todoList");
  const completeds = uni.getStorageSync("completedList");
  if (todos) todoList.push(...todos);
  if (completeds) completedList.push(...completeds);
});

const add = () => {
  uni.showModal({
    title: "提示",
    editable: true,
    success: function (res) {
      if (res.confirm) {
        todoList.push({
          id: todoList.length.toString(),
          content: res.content,
          finished: false,
        });
        save();
      }
    },
  });
};

const finished = (index) => {
  const todo = todoList[index];
  todoList.splice(index, 1);
  completedList.push(todo);
  save();
};

const delTodo = (index) => {
  todoList.splice(index, 1);
  save();
};

const delComputed = (index) => {
  completedList.splice(index, 1);
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

    box-shadow: 1px 1px 3px rgba(22, 26, 30, 0.9),
      -1px -1px 2px rgba(90, 102, 120, 0.9), 1px -1px 2px rgba(22, 26, 30, 0.2),
      -1px 1px 2px rgba(22, 26, 30, 0.2),
      inset -1px -1px 2px rgba(22, 26, 30, 0.5),
      inset 1px 1px 2px rgba(90, 102, 120, 0.3);
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
          }
          .clear {
            width: 1.2rem;
            height: 1.2rem;
            margin: 0 0.5rem;
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
