import { ItemTypeWithOrder } from '../types/types'

export type FullGridElementsType = ItemTypeWithOrder & { rowKey: string }

export const getAllGridElements = (layouts: {
    [p: string]: ItemTypeWithOrder[]
}): FullGridElementsType[] => {
    const fullGridElements: FullGridElementsType[] = []
    console.log(layouts, 'layouts')

    Object.keys(layouts).forEach((rowKey) => {
        layouts[rowKey].forEach((el) => {
            fullGridElements.push({ ...el, rowKey: rowKey })
        })
    })

    return fullGridElements
}

export const getTestGridEls = (layouts: {
    [p: string]: ItemTypeWithOrder[]
}) => {
    const fullGridElements: string[][] = []
    Object.keys(layouts).forEach((rowKey) => {
        fullGridElements.push(layouts[rowKey].map((el) => el.gridArea))
    })
    return fullGridElements
}
