import { ItemType, ItemTypeWithOrder } from '../../../types/types'
export type RowsType = {
    id: string
    order: number
}

export type InitGridLayoutStateType = {
    rows: RowsType[]
    layouts: { [key: string]: ItemTypeWithOrder[] }
    layoutsFake: { [key: string]: string[] }
    imageData: ItemType[]
    tempSettings: {
        increaseValue: number
    }
}
