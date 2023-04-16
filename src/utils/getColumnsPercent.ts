import { ItemTypeWithOrder } from '../types/types'

export const getColumnsPercent = (data: ItemTypeWithOrder[]): string => {
    if (Array.isArray(data) && data.length > 0) {
        let str = ''
        //data.forEach((el) => (str += `${el.columnPercent}% `))
        return str
    }
    return '100%'
}
