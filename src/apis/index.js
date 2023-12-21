const BASE_URL = 'https://mock.apifox.com/m1/3787137-0-default'

export const get = (url, query) => {
    return new Promise((resolve) => {
        uni.request({
            url: BASE_URL + url,
            data: query,
            success(res) {
                resolve(res.data)
            }
        })
    })
}

export const post = (url, body) => {
    return new Promise((resolve) => {
        uni.request({
            method: "POST",
            url: BASE_URL + url,
            data: body,
            success(res) {
                resolve(res.data)
            }
        })
    })
}

