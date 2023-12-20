<template>
    <view class="load-more">{{ text }}</view>
</template>

<script setup lang="ts">
import { computed, reactive } from 'vue';

const props = defineProps({
    status: {
        type: String,
        default: 'more'
    }
})

const text = computed(() => {
    const status = props.status
    if (status === 'more') {
        return '上拉显示更多'
    } else if (status === 'loading') {
        return '正在加载...'
    } else if (status === 'noMore') {
        return '没有更多数据了'
    } else {
        return ''
    }
})
</script>

<style lang="less">
.load-more {
    text-align: center;
    color: @my-color-primary;
    padding: 20rpx 0;
}
</style>