import { Layout } from 'react-grid-layout'

import { ItemType, ItemTypeWithOrder } from '../../../types/types'
export type RowsType = {
    id: string
    order: number
}

export interface ReactLayoutType extends Layout {
    i: string
    x: number
    y: number
    w: number
    h: number
    minW: number
    content: string
}

export type PositionInCell = 'center' | 'flex-end' | 'flex-start'

type ItemLayoutType = {
    id: string
    url: string
    positionInCell: PositionInCell
}

export type InitGridLayoutStateType = {
    rows: RowsType[]
    reactLayout: ReactLayoutType[]
    flexLayout: ItemLayoutType[][]
    layouts: { [key: string]: ItemTypeWithOrder[] }
    layoutsFake: { [key: string]: string[] }
    imageData: ItemType[]
    tempSettings: {
        increaseValue: number
    }
}
