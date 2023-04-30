import { ItemTypeWithOrder } from '../types/types'

import { getIntersectingElements } from './getIntersectingElements'
import { getResizeDirection } from './getResizeDirection'

export const resizerGrid = (
    id: string,
    rowId: string,
    newGridArea: string,
    oldGridArea: string,
    allElements: ItemTypeWithOrder[]
    //direction: ReturnType<typeof getResizeDirection>
) => {
    const direction = getResizeDirection(newGridArea, oldGridArea)
    const intersectingElements = getIntersectingElements(
        allElements.find((el) => el.id === id)!,
        allElements,
        direction
    )
    console.log('intersectingElements', intersectingElements)
    // switch (direction) {
    //     case 'right': {
    //         const aaaa = getIntersectingElements(
    //             currentElement,
    //             allElements,
    //             direction
    //         )
    //         console.log('aaaa', aaaa)
    //         break
    //     }
    //     case 'top': {
    //         break
    //     }
    //     case 'left': {
    //         break
    //     }
    //     case 'bottom': {
    //         break
    //     }
    //     default: {
    //         return ''
    //     }
    // }
}
