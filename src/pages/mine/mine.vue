<template>
    <view class="container">
        <view class="user-info">
            <image class="avatar" src="@/assets/images/Cat-logo.png"></image>
            <view>
                <view class="name">{{ state.user.name }}</view>
                <view class="sign">{{ state.user.sign }}</view>
            </view>
        </view>

        <view class="card">
            <view class="card-item">
                <view class="content">{{ state.user.pet_count }}</view>
                <view class="text">爱宠</view>
            </view>
            <view class="card-item">
                <view class="content">{{ state.user.record_day }}</view>
                <view class="text">记录天数</view>
            </view>
        </view>

        <view class="cell">
            <view class="text">关于我们</view>
            <view class="icon">></view>
        </view>
    </view>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import { getUser } from '@/apis/user.js'
import { onLoad } from '@dcloudio/uni-app';

const state = reactive({
    user: {}
})

onLoad(() => {
    getUserInfo()
})

const getUserInfo = async () => {
    const { user } = await getUser({ openid: '123' })
    state.user = user

}
</script>

<style lang="less" scoped>
.container {
    padding: 0 30rpx;

    .user-info {
        display: flex;
        align-items: center;
        margin: 0 -10rpx;
        margin-top: 90rpx;
        margin-bottom: 40rpx;

        .avatar {
            width: 120rpx;
            height: 120rpx;
            border-radius: 50%;
            margin-right: 15rpx;
            background: #fff;
        }

        .name {
            font-size: 35rpx;
            font-weight: bold;
        }

        .sign {
            color: @my-text-color-grey;
            margin-top: 5rpx;
        }
    }

    .card {
        background-color: #fff;
        border-radius: 20rpx;
        display: flex;
        padding: 20rpx;
        flex-wrap: wrap;
        justify-content: space-around;
        margin-bottom: 40rpx;

        .card-item {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            width: 50%;
            box-sizing: border-box;
            border-right: 1px solid @my-text-color-grey-opacity;

            .content {
                font-size: 40rpx;
                font-weight: bold;
                color: @my-color-primary;
            }


            &:last-child {
                border: none;
            }
        }


    }

    .cell {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin: 10rpx 0;

        .text {
            font-weight: bold;
        }

        .icon {
            color: @my-text-color-grey;
        }
    }
}
</style>