import { get } from './index'

export const getUser = ({ openid }) => {
    return get("/user", { openid: openid })
}