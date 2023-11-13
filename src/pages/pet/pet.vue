<template>
  <view class="container">
    <view class="user-info">
      <image class="avatar" src="@/assets/images/Cat-logo.png"></image>
      <text class="name">Wade Warren</text>
    </view>

    <!-- 我的宠物 -->
    <view class="pet-list">
      <view
        v-for="(pet, index) in petList"
        :key="pet.id"
        class="pet"
        :class="{
          active: state.selectedPetId === pet.id,
        }"
        @click="onClickPet(pet.id)"
        @longpress="onLongPress(index)"
      >
        <image class="avatar" :src="pet.avatar"></image>
        <view class="info">
          <text class="age">{{ pet.age }} Years old</text>
          <text class="name">{{ pet.name }}</text>
        </view>
        <view
          class="call"
          :class="{ 'to-back': state.showDeleteIndex == index }"
          @click="toDetail(pet.id)"
          >Call</view
        >
        <view
          class="delete"
          :class="{ 'to-front': state.showDeleteIndex == index }"
          @click="deletePet(pet.id)"
          >删除</view
        >
      </view>
      <!-- 新增 -->
      <view class="pet add">
        <image class="avatar" src="@/assets/svgs/claw-qian-pink.svg"></image>
        <view class="call" @click="showPopup">新增</view>
      </view>
    </view>

    <!-- 我的计划 -->
    <Plan
      :data="selectedPet?.plans"
      @add="addPlan"
      @delete="deletePlan"
      @done="donePlan"
    ></Plan>

    <!-- 新增宠物 -->
    <MyPopup :show="state.isShowPopup" @hide="hidePopup">
      <view class="popup">
        <view class="title">新增</view>
        <view class="form">
          <MyForm :model="state.newPet" :rules="rules" ref="myForm">
            <MyFormItem label="名称" prop="name"
              ><MyInput maxlength="6" v-model="state.newPet.name" />
            </MyFormItem>
            <MyFormItem label="年龄"
              ><slider
                name="age"
                min="0.5"
                max="20"
                step="0.5"
                class="slider"
                block-size="22"
                activeColor="@my-color-primary"
                show-value
                value="0.5"
              ></slider
            ></MyFormItem>
            <MyFormItem label="类别">
              <MyRadioGroup v-model="state.newPet.category">
                <MyRadio value="cat" label="猫猫" />
                <MyRadio value="dog" label="狗狗" />
              </MyRadioGroup>
            </MyFormItem>
            <button class="submit" @click="handleNewPetSubmit">完成</button>
          </MyForm>
        </view>
      </view>
    </MyPopup>

    <MyMessage ref="myMessageRef"></MyMessage>

    <MyDialog ref="myDialog"></MyDialog>
  </view>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from "vue";
import { usePetStore } from "@/stores/pet";
import { type Pet } from "@/types/pet";
import { type Plan } from "@/types/plan";

const rules = {
  name: [{ required: true, message: "请填写名称" }],
};
const myForm: any = ref(null);
const myMessageRef: any = ref(null);
const myDialog: any = ref(null);
const petStore = usePetStore();
const state = reactive({
  isShowPopup: false,
  isShowTip: false,
  showDeleteIndex: -1,
  selectedPetId: "",
  newPet: {
    id: "",
    avatar: "",
    name: "",
    age: "0.5",
    sex: "母",
    category: "cat",
    color: "白",
    weight: ".5",
    plans: [],
  } as Pet,
  planList: [
    {
      dueTime: "2023/10/08 14:15",
      avatar: "",
      title: "喂罐头",
      notes: "半罐",
      time: "40",
    },
    {
      dueTime: "2023/10/08 16:15",
      avatar: "",
      title: "喂化毛膏",
      notes: "5cm",
      time: "40",
    },
  ],
});
const petList = computed(() => petStore.petList);
const selectedPet = computed(() => {
  const pet = petList.value.find((pet) => pet.id === state.selectedPetId);
  return pet || null;
});

onMounted(() => {
  petStore.initPetList();
  if (petList.value.length) {
    state.selectedPetId = petList.value[0].id;
  }
});

function onLongPress(index: number) {
  uni.vibrateLong();
  if (state.showDeleteIndex === index) {
    state.showDeleteIndex = -1;
  } else {
    state.showDeleteIndex = index;
  }
}

function toDetail(id: string) {
  if (id) {
    if (petStore.getPetById(id)) {
      uni.navigateTo({
        url: `/pages/pet/detail?id=${id}`,
      });
    } else {
      myMessageRef.value.show({
        message: "查找不到该宠物信息",
        type: "error",
      });
    }
  } else {
    myMessageRef.value.show({
      message: "查找不到该宠物信息",
      type: "error",
    });
  }
}

function showPopup() {
  state.isShowPopup = true;
}

function hidePopup() {
  state.isShowPopup = false;
}

function deletePet(id: string) {
  myDialog.value.open({
    title: "删除宠物信息",
    content: "确认删除该宠物信息？",
    confirm() {
      petStore.deletePetById(id);
      myMessageRef.value.show({
        message: `删除成功`,
      });
    },
  });
  state.showDeleteIndex = -1;
}

function handleNewPetSubmit() {
  myForm.value.validate((valid: boolean) => {
    if (valid) {
      hidePopup();
      petStore.addPetToLast(state.newPet);
      myMessageRef.value.show({
        message: "添加成功",
      });
    }
  });
}

function deletePlan(id: string) {
  myDialog.value.open({
    title: "删除计划",
    content: "确认删除该计划？",
    confirm() {
      const plan = petStore.getPetPlanById(state.selectedPetId, id);
      let title = "";
      if (plan) {
        title = plan.title;
      }
      petStore.deletePetPlanById(state.selectedPetId, id);
      myMessageRef.value.show({
        message: `删除【${title}】`,
      });
    },
  });
}

function donePlan(id: string) {
  const plan = petStore.getPetPlanById(state.selectedPetId, id);
  let title = "";
  if (plan) {
    title = plan.title;
  }
  petStore.completePetPlanById(state.selectedPetId, id);
  myMessageRef.value.show({
    message: `完成【${title}】`,
  });
}

function onClickPet(id: string) {
  state.selectedPetId = id;
}

function addPlan(plan: Plan) {
  petStore.addPetPlanById(state.selectedPetId, plan);
  myMessageRef.value.show({
    message: "添加成功",
  });
}
</script>

<style lang="less" scoped>
.container {
  height: 100vh;
  background: @my-background-color;
  padding-top: 5rem;

  .user-info {
    display: flex;
    align-items: center;
    margin: 0 1.5rem;
    margin-bottom: 1.5rem;

    .avatar {
      width: 3rem;
      height: 3rem;
      border-radius: 50%;
      margin-right: 1rem;
      background: @my-color-primary;
      box-shadow: 0px 2px 8px #aa69ffd4;
    }

    .name {
      font-weight: bold;
      font-size: 1.5rem;
    }
  }

  .pet-list {
    display: flex;
    overflow: auto;
    padding: 0.5rem 1.5rem;
    margin-bottom: 1rem;
    align-items: center;

    .pet {
      min-width: 8rem;
      height: 12rem;
      display: flex;
      flex-direction: column;
      border-radius: 1.5rem;
      background-color: #fff;
      overflow: hidden;
      margin-right: 1rem;
      position: relative;
      box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.1);
      transition: all 0.1s linear;

      .avatar {
        width: 100%;
        height: 50%;
      }

      .info {
        padding: 0.8rem;
        padding-bottom: 0;
        display: flex;
        flex-direction: column;

        .age {
          color: @my-text-color-grey;
          font-size: 0.8rem;
        }
        .name {
          font-weight: bold;
        }
      }
      .call,
      .delete {
        height: 2rem;
        text-align: center;
        line-height: 2rem;
        background: @my-color-primary;
        color: #fff;
        margin: 0.5rem 0.8rem;
        border-radius: 1rem;
        font-size: 0.8rem;
        transition: all ease-in-out 0.5s;
        position: absolute;
        width: 80%;
        bottom: 0;
        z-index: 50;
      }

      .delete {
        z-index: 40;
        opacity: 0;
        transform: rotateY(-180deg);
        background: @my-color-error;
      }

      .to-back {
        opacity: 0;
        transform: rotateY(180deg);
        transition: all ease-in-out 0.5s;
      }

      .to-front {
        opacity: 1;
        transform: rotateY(0deg);
        transition: all ease-in-out 0.5s;
        z-index: 60;
      }
      &.active {
        transform: scale(1.05);
        box-shadow: 1px 1px 5px rgba(170, 105, 255, 0.5);
      }
    }

    .add {
      margin-right: 0;
      .avatar {
        margin-top: 2rem;
      }
      .call {
        margin-top: 2rem;
      }
    }
  }

  .popup {
    padding-bottom: 0;
    width: 60vw;

    .title {
      font-weight: bold;
      font-size: 1.2rem;
      color: @my-color-primary;
      margin-bottom: 1rem;
    }

    .form {
      margin-bottom: 1rem;
      .tip {
        margin: 0.2rem 0;
        font-size: 0.8rem;
        color: @my-color-error;
      }
      .submit {
        background: @my-color-primary;
        color: #fff;
        font-size: 1rem;
        border-radius: 0.8rem;
        margin-top: 2rem;
        &::after {
          border: none;
        }
      }
    }
  }
}
</style>
