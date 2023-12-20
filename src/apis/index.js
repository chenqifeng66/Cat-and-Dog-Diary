export const getNoties = ({ page }) => {
    return uni.request({
        url: 'https://mock.apifox.com/m1/3787137-0-default/noties',
        data: {
            page: page
        },
    })
}