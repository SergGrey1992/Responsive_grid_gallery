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

    let rowsAfterCurrent = generateCross(+currentStartRow, +currentEndRow)

    console.log(rowsAfterCurrent, 'columnsAfterCurrent')

    console.log('currentElement', currentElement)
    const allElementsWithoutCurrentElement = allElements.filter(
        (element) => element.id !== currentElement.id
    )

    const allElementsWithoutTopsElement =
        allElementsWithoutCurrentElement.filter((element) => {
            const [startRow, startColumn, endRow, endColumn] =
                getGridAreaValues(element.gridArea)

            let rowsForElement: number[] = generateCross(startRow, endRow)

            const crossing = getCrossingForArrays(
                rowsAfterCurrent,
                rowsForElement
            )

            // debugger
            return crossing > 1
        })
    console.log('allElementsWithoutTopsElement', allElementsWithoutTopsElement)
    const allElementsWithoutBottomElement =
        allElementsWithoutTopsElement.filter((element) => {
            const [startRow, startColumn, endRow, endColumn] =
                getGridAreaValues(element.gridArea)

            let rowsForElement: number[] = generateCross(startRow, endRow)

            const crossing = getCrossingForArrays(
                rowsAfterCurrent,
                rowsForElement
            )

            // debugger
            return crossing > 1
        })
    // console.log(
    //     'allElementsWithoutBottomElement',
    //     allElementsWithoutBottomElement
    // )
    const allElementsWithoutLeftElement =
        allElementsWithoutBottomElement.filter((element) => {
            const [startRow, startColumn, endRow, endColumn] =
                getGridAreaValues(element.gridArea)
            return currentStartColumn <= endColumn
        })

    //console.log('allElementsWithoutLeftElement', allElementsWithoutLeftElement)

    return allElements.filter((element) => {
        if (element.id === currentElement.id) return false // Исключаем сам увеличивающийся элемент
        const arrayGridAreas = allElements
            .filter((el) => el.id !== currentElement.id)
            .map((el) => el.gridArea)
        //console.log('arrayGridAreas', arrayGridAreas)

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
    debugger

    let index = startRow

    while (index <= endRow) {
        rows.push(index)

        index++
    }

    return rows
}

export function increaseGridAreaAndRecalculate(
    elements: any[][],
    increaseBy: number,
    targetIndex: number,
    itemIndex: number
): any[][] {
    let target = elements[targetIndex]
    let multiRowElementExists = false
    let rowSpanList: number[] = []

    // Определение максимального количества строк, занимаемых элементами в массиве
    for (let i = 0; i < target.length; i++) {
        let [rowStart, _, rowEnd, __] = target[i].split('/').map(Number)
        let rowSpan = rowEnd - rowStart
        rowSpanList.push(rowSpan)
        if (rowSpan > 1) {
            multiRowElementExists = true
        }
    }

    if (multiRowElementExists) {
        // Пересчитать и сдвинуть элементы во всех затронутых строках
        for (let i = 0; i < rowSpanList.length; i++) {
            for (let j = 0; j < elements[targetIndex + i].length; j++) {
                let [rowStart, colStart, rowEnd, colEnd] = elements[
                    targetIndex + i
                ][j]
                    .split('/')
                    .map(Number)
                elements[targetIndex + i][j] = `${rowStart}/${
                    colStart + (j > itemIndex ? increaseBy : 0)
                }/${rowEnd}/${colEnd + (j > itemIndex ? increaseBy : 0)}`
            }
        }
    } else {
        // Увеличиваем размер выбранного элемента
        let [rowStart, colStart, rowEnd, colEnd] = target[itemIndex]
            .split('/')
            .map(Number)
        target[itemIndex] = `${rowStart}/${colStart}/${rowEnd}/${
            colEnd + increaseBy
        }`

        // Сдвигаем все элементы после целевого на заданное количество колонок
        for (let i = itemIndex + 1; i < target.length; i++) {
            let [rowStart, colStart, rowEnd, colEnd] = target[i]
                .split('/')
                .map(Number)
            target[i] = `${rowStart}/${colStart + increaseBy}/${rowEnd}/${
                colEnd + increaseBy
            }`
        }
    }

    return elements
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

function shiftElement(gridArea: string, shiftCols: number) {
    const [rstart, cstart, rend, cend] = gridArea.split('/').map(Number)
    return `${rstart}/${cstart + shiftCols}/${rend}/${cend + shiftCols}`
}

export function updateLayout(
    layouts: { [p: string]: ItemTypeWithOrder[] },
    rowId: string,
    itemId: string,
    colShift: number
) {
    console.log('rowId', rowId)
    console.log('itemId', itemId)
    if (!layouts[rowId]) {
        console.error('Row not found')
        return layouts
    }

    const movingItem = layouts[rowId].find((it) => it.id === itemId)

    if (!movingItem) {
        console.error('Item not found')
        return layouts
    }

    const newRowLayout = layouts[rowId].map((item) => {
        if (item.id === itemId) {
            const newGridArea = shiftElement(item.gridArea, colShift)
            return { ...item, gridArea: newGridArea }
        } else if (hasIntersection(movingItem.gridArea, item.gridArea)) {
            const newGridArea = shiftElement(item.gridArea, colShift)
            return { ...item, gridArea: newGridArea }
        }
        return item
    })

    return {
        ...layouts,
        [rowId]: newRowLayout,
    }
}
