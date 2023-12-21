import { get } from './index'

export const getNoties = ({ page }) => {
    return get('/noties', { page: page })
}