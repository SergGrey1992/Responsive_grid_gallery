import { ItemTypeWithOrder } from '../types/types'

export const getAllGridElements = (layouts: {
    [p: string]: ItemTypeWithOrder[]
}): ItemTypeWithOrder[] => {
    const fullGridElements: ItemTypeWithOrder[] = []

    Object.keys(layouts).forEach((rowKey) => {
        fullGridElements.push(...layouts[rowKey])
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
