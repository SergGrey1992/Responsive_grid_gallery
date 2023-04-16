export type ItemType = {
    id: string
    url: string
    backgroundColor: string
}

export type ItemVariantType = 'fake' | 'img' | 'video'

export type ItemTypeWithOrder = {
    order: number
    gridArea: string
    type: ItemVariantType
    //columnPercent: number
} & ItemType

export interface DropResult {
    item: ItemType
}

//
export const ItemTypes = {
    BOX: 'box',
}
