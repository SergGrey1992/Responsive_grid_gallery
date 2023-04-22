import { ItemTypeWithOrder } from '../types/types'

export const createGridItem = (
    item: ItemTypeWithOrder,
    order: number,
    gridArea: string
): ItemTypeWithOrder => {
    return {
        ...item,
        order: order + 1,
        gridArea,
    }
}
