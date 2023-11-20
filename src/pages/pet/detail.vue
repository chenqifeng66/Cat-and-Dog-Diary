<template>
  <view class="container">
    <view class="avatar">
      <image class="icon" :src="petDetails.avatar"></image>
    </view>

    <view class="info">
      <view class="detail">
        <view class="top">
          <view class="left">
            <text class="name">{{ petDetails.name }}</text>
            <text class="age">{{ petDetails.age }} Years old</text>
          </view>
          <view class="right">
            <view class="edit" @click="showEditPopup">
              <image class="icon" src="@/assets/svgs/edit.svg"></image>
            </view>
          </view>
        </view>
        <view class="tags">
          <view class="tag">
            <text class="tag-icon">😺</text>
            <text class="tag-name">性别</text>
            <text class="tag-info">{{ petDetails.sex }}</text>
            <view class="divider"></view>
          </view>
          <view class="tag">
            <text class="tag-icon">🎨</text>
            <text class="tag-name">颜色</text>
            <text class="tag-info">{{ petColor }}</text>
            <view class="divider"></view>
          </view>
          <view class="tag">
            <text class="tag-icon">📖</text>
            <text class="tag-name">品种</text>
            <text class="tag-info">{{ petCategory }}</text>
            <view class="divider"></view>
          </view>
          <view class="tag">
            <text class="tag-icon">⚖️</text>
            <text class="tag-name">体重</text>
            <text class="tag-info">{{ petDetails.weight }}kg</text>
          </view>
        </view>
      </view>

      <!-- 计划 -->
      <Plan :data="petDetails.plans" @add="addPlan"></Plan>
    </view>

    <!-- 编辑信息 -->
    <MyPopup
      v-if="state.isShowEditPopup"
      :show="state.isShowEditPopup"
      @hide="hidePopup"
    >
      <view class="popup">
        <view class="title">编辑</view>
        <MyForm :model="state.editPetDetails" :rules="rules" ref="myFormRef">
          <MyFormItem label="头像">
            <view class="form-avatar">
              <view class="avatar-list">
                <!-- 宠物头像 -->
                <image
                  v-if="state.editPetDetails.avatar"
                  class="avatar"
                  :class="{
                    active:
                      state.editPetDetails.avatar !== cat
                        ? state.isChooseNewAvatar
                        : true,
                  }"
                  :src="state.editPetDetails.avatar"
                  @click="chooseAvatar(true, state.editPetDetails.avatar)"
                ></image>
                <!-- 默认头像 -->
                <image
                  v-if="state.editPetDetails.avatar !== cat"
                  class="avatar"
                  :class="{
                    active: !state.isChooseNewAvatar,
                  }"
                  :src="cat"
                  @click="chooseAvatar(false)"
                ></image
              ></view>
              <!-- 上传按钮 -->
              <image
                class="icon"
                src="@/assets/svgs/upload.svg"
                @click="uploadAvatar"
              ></image>
            </view>
          </MyFormItem>
          <MyFormItem label="性别">
            <MyRadioGroup name="sex" v-model="state.editPetDetails.sex">
              <MyRadio value="公" label="公" />
              <MyRadio value="母" label="母" />
            </MyRadioGroup>
          </MyFormItem>
          <MyFormItem label="颜色"
            ><MySelect name="color" v-model="state.editPetDetails.color">
              <MyOption
                v-for="color in state.colorList"
                :key="color.value"
                :label="color.label"
                :value="color.value"
              ></MyOption> </MySelect
          ></MyFormItem>

          <MyFormItem label="品种">
            <MySelect
              name="cate"
              v-model="state.editPetDetails.category"
              :height="'8rem'"
            >
              <MyOption
                v-for="cate in state.categoryList"
                :key="cate.value"
                :label="cate.label"
                :value="cate.value"
              ></MyOption>
            </MySelect>
          </MyFormItem>

          <MyFormItem label="体重/kg" prop="weight"
            ><MyInput
              name="weight"
              type="number"
              v-model="state.editPetDetails.weight"
            />
          </MyFormItem>

          <button class="submit" @click="handleEditPetSubmit">完成</button>
        </MyForm>
      </view>
    </MyPopup>

    <MyMessage ref="myMessageRef"></MyMessage>
  </view>
</template>

<script setup lang="ts">
import { ref, reactive, computed, nextTick, watch } from "vue";
import { type Pet } from "@/types/pet";
import { type Plan } from "@/types/plan";
import { onLoad } from "@dcloudio/uni-app";
import { usePetStore } from "@/stores/pet";
import cat from "@/assets/images/cat.png";

const myFormRef: any = ref(null);
const myMessageRef: any = ref(null);
const petStore = usePetStore();
const state = reactive({
  isShowEditPopup: false,
  petId: "",
  editPetDetails: {} as Pet,
  isChooseNewAvatar: false,
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
  colorList: [
    {
      value: "1",
      label: "白",
    },
    {
      value: "2",
      label: "白棕",
    },
    {
      value: "3",
      label: "黑",
    },
  ],
  categoryList: [
    {
      value: "1",
      label: "布偶",
    },
    {
      value: "2",
      label: "暹罗",
    },
    {
      value: "3",
      label: "英短",
    },
    {
      value: "4",
      label: "美短",
    },
    {
      value: "5",
      label: "中华田园",
    },
    {
      value: "6",
      label: "大橘",
    },
    {
      value: "7",
      label: "缅因",
    },
  ],
});
const rules = {
  weight: [
    {
      required: true,
      message: "请输入体重",
    },
  ],
};

const petDetails = computed(() => {
  if (state.petId) {
    const pet = petStore.getPetById(state.petId);
    if (pet) {
      return pet;
    } else {
      nextTick(() => {
        myMessageRef.value.show({
          message: "查找不到该宠物信息",
          type: "error",
          complete() {
            uni.navigateTo({ url: "/pages/pet/pet" });
          },
        });
      });
      return {} as Pet;
    }
  } else {
    return {} as Pet;
  }
});

watch(petDetails, (newValue) => {
  state.editPetDetails = { ...newValue };
});

onLoad((option: any) => {
  if (option.id) {
    petStore.initPetList();
    state.petId = option.id;
  }
});

const petColor = computed(() => {
  return state.colorList.find((color) => color.value === petDetails.value.color)
    ?.label;
});

const petCategory = computed(() => {
  return state.categoryList.find(
    (cate) => cate.value === petDetails.value.category
  )?.label;
});

function hidePopup() {
  state.isShowEditPopup = false;
}

function showEditPopup() {
  state.isShowEditPopup = true;
}

function chooseAvatar(isChooseNewAvatar: boolean, newAvatarUrl?: string) {
  state.isChooseNewAvatar = isChooseNewAvatar;
  if (isChooseNewAvatar && newAvatarUrl) {
    state.editPetDetails.avatar = newAvatarUrl;
  } else {
    state.editPetDetails.avatar = "";
  }
}

function handleEditPetSubmit() {
  myFormRef.value.validate((valid: boolean) => {
    if (valid) {
      hidePopup();
      petStore.editPetById(state.editPetDetails.id, state.editPetDetails);
      myMessageRef.value.show({
        message: "修改成功",
      });
    }
  });
}

function uploadAvatar() {
  uni.chooseMedia({
    count: 1,
    mediaType: ["image"],
    sizeType: ["original"],
    success(res) {
      const file = res.tempFiles[0];
      console.log(res);

      if (/.png$/.test(file.tempFilePath)) {
        // uni.compressImage({
        //   src: file.tempFilePath,
        //   success(res) {
        //     console.log(res);
        //   },
        // });
        // if (file.size < 1000 * 1000) {
        state.editPetDetails.avatar = file.tempFilePath;
        state.isChooseNewAvatar = true;
        //   myMessageRef.value.show({
        //     message: "上传成功",
        //   });
        // } else {
        //   myMessageRef.value.show({
        //     message: "图片大小超过1M",
        //     type: "error",
        //   });
        // }
      } else {
        myMessageRef.value.show({
          message: "请上传 png 类型的图片",
          type: "error",
        });
      }
    },
  });
}

function addPlan(plan: Plan) {
  if (petDetails.value) {
    const pet = { ...petDetails.value };
    pet.plans.push(plan);
    petStore.editPetById(pet.id, pet);
  }
}
</script>

<style lang="less" scoped>
.container {
  .avatar {
    width: 100%;
    height: 40vh;
    background: @my-color-primary;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    .icon {
      width: 100%;
      height: 100%;
    }
    .upload {
      width: 2rem;
      height: 2rem;
      position: absolute;
      right: 1.5rem;
      bottom: 15%;
    }
  }
  .info {
    width: 100%;
    height: 70vh;
    position: relative;
    margin-top: -2rem;
    box-sizing: border-box;

    .detail {
      background: #fff;
      padding: 1rem 1.5rem;
      border-radius: 1.3rem 1.3rem 2rem 0;
      margin-bottom: 2rem;
      position: relative;

      &::after {
        content: "";
        position: absolute;
        bottom: -2rem;
        left: 0;
        background: #fff;
        display: block;
        width: 2rem;
        height: 2rem;
      }
      &::before {
        content: "";
        position: absolute;
        bottom: -2rem;
        left: 0;
        background: @my-background-color;
        display: block;
        width: 2rem;
        height: 2rem;
        z-index: 2;
        border-radius: 2rem 0 0 0;
      }
      .top {
        display: flex;
        justify-content: space-between;
        align-items: center;
        .left {
          display: flex;
          flex-direction: column;
          .name {
            font-weight: bold;
            font-size: 1.5rem;
          }
          .age {
            color: @my-text-color-grey;
          }
        }
        .right {
          .edit {
            width: 2rem;
            height: 2rem;
            display: flex;
            justify-content: center;
            align-items: center;
            .icon {
              width: 80%;
              height: 80%;
            }
          }
        }
      }
      .tags {
        display: flex;
        .tag {
          width: 25%;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding-top: 1rem;
          position: relative;
          .tag-icon {
            margin-bottom: 0.3rem;
            font-size: 1.6rem;
          }
          .tag-name {
            color: @my-text-color-grey;
            font-size: 0.6rem;
            margin-bottom: 0.3rem;
          }
          .tag-info {
            font-weight: bold;
          }
          .divider {
            position: absolute;
            right: 0;
            top: 50%;
            transform: translateY(-50%);
            width: 1.5px;
            height: 1rem;
            background: #e7e7e792;
          }
        }
      }
    }
  }
  .popup {
    width: 60vw;
    .title {
      font-weight: bold;
      font-size: 1.2rem;
      color: @my-color-primary;
      margin-bottom: 1rem;
    }
    .form-avatar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      .avatar-list {
        display: flex;
        .avatar {
          width: 3rem;
          height: 3rem;
          border-radius: 50%;
          box-sizing: border-box;
          margin-right: 1rem;
          opacity: 0.3;
          &.active {
            opacity: 1;
          }
        }
      }
      .icon {
        width: 2rem;
        height: 2rem;
      }
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
</style>
