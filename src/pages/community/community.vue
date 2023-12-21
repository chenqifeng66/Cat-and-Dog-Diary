<template>
    <view class="container">
        <view class="title">
            社区
        </view>

        <view class="note-list">
            <view class="note" v-for="note in state.noties" :key="note.id">
                <image class="cover" :src="note.cover"></image>
                <view class="note-title">
                    {{ note.title }}
                </view>
                <view class="author">{{ note.author }}</view>
            </view>
        </view>

        <MyLoadMore :status="state.status"></MyLoadMore>
    </view>
</template>

<script setup lang="ts">
import { onLoad, onReachBottom } from '@dcloudio/uni-app';
import { getNoties } from '@/apis/community.js'
import { reactive } from 'vue';

// enum Status { more, loading, noMore }

const state = reactive({
    page: 1,
    total: 0,
    noties: [],
    status: "more"
})

onLoad(() => {
    getNoteList()
})

onReachBottom(() => {
    if (state.status === 'more') {
        getNoteList()
    }
})

const getNoteList = async () => {
    state.status = 'loading'
    const { noties, current_page, total } = await getNoties({ page: state.page })

    if (state.page === current_page) {
        state.status = 'noMore'
    } else {
        state.status = 'more'
        state.noties.push(...noties)
        state.page = current_page
        state.total = total
    }
}


</script>

<style lang="less" scoped>
.container {
    width: 100vw;
    padding-top: 5rem;

    .title {
        width: 100%;
        text-align: center;
        font-size: 40rpx;
        font-weight: bold;
        margin-bottom: 20rpx;
    }

    .note-list {
        margin: 0 auto;
        column-count: 2;
        column-gap: 20rpx;
        padding: 0 20rpx;
        margin-bottom: 20rpx;

        .note {
            display: flex;
            flex-direction: column;
            background: #fff;
            border-radius: 10rpx;
            overflow: hidden;
            padding-bottom: 10rpx;
            margin-bottom: 15rpx;
            break-inside: avoid;

            .cover {
                width: 100%;
                min-height: 100rpx;
                max-height: 300rpx;
            }

            .note-title {
                word-break: break-all;
                text-overflow: ellipsis;
                display: -webkit-box;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 2;
                /* 这里是超出几行省略 */
                overflow: hidden;
                margin: 20rpx;
            }

            .author {
                color: @my-text-color-grey;
                margin: 0 20rpx;
            }
        }
    }
}
</style>