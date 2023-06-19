import { ItemTypeWithOrder } from '../types/types'

import { getGridAreaValues } from './getGridAreaValues'
import { getResizeDirection } from './getResizeDirection'

const rowsOverlap = (
    rows1: [number, number],
    rows2: [number, number],
    isSingleRow: boolean
): boolean => {
    const [startRow1, endRow1] = rows1
    const [startRow2, endRow2] = rows2

    if (isSingleRow) {
        return (
            (startRow1 === startRow2 && endRow1 === endRow2) ||
            (startRow2 >= startRow1 && startRow2 <= endRow1) ||
            (endRow2 >= startRow1 && endRow2 <= endRow1)
        )
    } else {
        return (
            (startRow1 >= startRow2 && startRow1 <= endRow2) ||
            (endRow1 >= startRow2 && endRow1 <= endRow2) ||
            (startRow2 >= startRow1 && startRow2 <= endRow1) ||
            (endRow2 >= startRow1 && endRow2 <= endRow1)
        )
    }
}

const getElementsOnSameRows = (
    currentElement: ItemTypeWithOrder,
    allElements: ItemTypeWithOrder[]
): ItemTypeWithOrder[] => {
    const [currentStartRow, , currentEndRow] = getGridAreaValues(
        currentElement.gridArea
    )
    console.log('gridArea', currentElement.gridArea)
    return allElements.filter((element) => {
        const [startRow, , endRow] = getGridAreaValues(element.gridArea)
        return (
            element.id !== currentElement.id &&
            rowsOverlap(
                [currentStartRow, currentEndRow],
                [startRow, endRow],
                endRow - startRow === 0
            )
        )
    })
}

export const getIntersectingElements = (
    currentElement: ItemTypeWithOrder,
    allElements: ItemTypeWithOrder[],
    direction: ReturnType<typeof getResizeDirection>
): ItemTypeWithOrder[] => {
    const [
        currentStartRow,
        currentStartColumn,
        currentEndRow,
        currentEndColumn,
    ] = getGridAreaValues(currentElement.gridArea)

    const allElementsWithoutCurrentElement = allElements.filter(
        // Исключаем сам увеличивающийся элемент
        (element) => !(element.id === currentElement.id)
    )

    return allElementsWithoutCurrentElement.filter((element) => {
        const [startRow, startColumn, endRow, endColumn] = getGridAreaValues(
            element.gridArea
        )

        let isIntersecting = false

        if (direction === 'right') {
            isIntersecting =
                currentEndColumn <= endColumn && currentEndRow <= endRow
        }

        return isIntersecting
    })
}

const getCrossingForArrays = (arr1: number[], arr2: number[]) => {
    let cross = 0

    arr1.forEach((el) => {
        const isFound = arr2.find((el2) => el === el2)

        isFound && cross++
    })

    return cross
}

const generateCross = (startRow: number, endRow: number) => {
    let rows: number[] = []
    //debugger

    let index = startRow

    while (index <= endRow) {
        rows.push(index)

        index++
    }

    return rows
}

function hasIntersection(gridArea1: string | undefined, gridArea2: string) {
    if (gridArea1) {
        const [r1start, c1start, r1end, c1end] = gridArea1
            .split('/')
            .map(Number)
        const [r2start, c2start, r2end, c2end] = gridArea2
            .split('/')
            .map(Number)

        const rowIntersect = r1end > r2start && r1start < r2end
        const colIntersect = c1end > c2start && c1start < c2end

        return rowIntersect && colIntersect
    }
}
