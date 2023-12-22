import { get } from './index'

export const getColors = () => {
    return get('/colors')
}

export const getPetCategories = ({type}) => {
    return get("/pet_categories",{type:type})
}