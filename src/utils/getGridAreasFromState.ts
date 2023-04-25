import { ItemTypeWithOrder } from '../types/types'

import { getAllGridElements } from './getAllGridElements'

export const getGridAreasFromState = (layouts: {
    [p: string]: ItemTypeWithOrder[]
}) => {
    const allGridElements = getAllGridElements(layouts).map((el) => el.gridArea)
    console.log('FULL_GRID_AREAS => ', allGridElements)
}
