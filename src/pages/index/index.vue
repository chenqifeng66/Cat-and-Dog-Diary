<template>
  <view class="container">
    <view class="logo">Todo</view>
    <view class="main">
      <checkbox-group>
        <view class="todo" v-for="(todo, index) in todoList" :key="todo.id">
          <view class="left" :class="{ finished: todo.finished }">
            {{ index + 1 }}.
          </view>

          <view class="middle">
            <view class="content" :class="{ finished: todo.finished }">{{
              todo.title
            }}</view>
            <checkbox :checked="todo.finished" @click="clickTodo(index)"
          /></view>
          <!-- <view class="right">
          <button>完成</button>
          <button>重做</button>
        </view> -->
        </view>
      </checkbox-group>
    </view>
    <view class="add">
      <button @click="add">添加</button>
    </view>
  </view>
</template>

<script setup>
import { uni } from "@dcloudio/uni-h5";
import { onMounted, reactive } from "vue";

const todoList = reactive([]);

onMounted(() => {
  const todos = uni.getStorageSync("todoList");
  if (todos) todoList.push(...todos);
});

const add = () => {
  uni.showModal({
    title: "提示",
    editable: true,
    success: function (res) {
      if (res.confirm) {
        todoList.push({
          id: todoList.length.toString(),
          title: res.content,
          finished: false,
        });
        save();
      }
    },
  });
};

const clickTodo = (index) => {
  const todo = todoList[index];
  todoList.splice(index, 1);

  if (todo.finished) {
    todo.finished = false;
    todoList.unshift(todo);
  } else {
    todo.finished = true;
    todoList.push(todo);
  }
  save();
};

const save = () => {
  uni.setStorageSync("todoList", todoList);
};
</script>

<style lang="less">
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 3rem 3rem;
  padding: 1rem 0;
  border: 1px solid #ccc;
  border-radius: 0.5rem;

  .logo {
    font-size: 2rem;
    margin-bottom: 1rem;
  }

  .main {
    width: 100%;

    .todo {
      border-top: 1px solid #ccc;
      display: flex;
      padding: 1rem;

      .left {
        width: 2rem;
      }

      .middle {
        display: flex;
        flex: 1;
        justify-content: space-between;
      }
      .right {
        display: flex;
      }
    }
  }
}

.finished {
  color: #ccc;
  text-decoration: line-through;
}
</style>
