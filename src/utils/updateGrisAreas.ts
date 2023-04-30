import { MAX_COLUMN } from '../constants'
import { ItemTypeWithOrder } from '../types/types'

import { getClone } from './getClone'
import { getGridAreaValues } from './getGridAreaValues'

function isOverlapping(
    a: [number, number, number, number],
    b: [number, number, number, number]
): boolean {
    const [aRowStart, aColStart, aRowEnd, aColEnd] = a
    const [bRowStart, bColStart, bRowEnd, bColEnd] = b

    const isRowOverlapping =
        (aRowStart < bRowEnd && aRowEnd > bRowStart) ||
        (bRowStart < aRowEnd && bRowEnd > aRowStart)
    const isColOverlapping = aColEnd > bColStart && aColStart < bColEnd

    return isRowOverlapping && isColOverlapping
}

function shiftElements(
    gridAreas: ItemTypeWithOrder[],
    startIndex: number,
    updatedElement: [number, number, number, number],
    increaseBy: number,
    shouldShift: boolean
): ItemTypeWithOrder[] {
    if (startIndex >= gridAreas.length) {
        return gridAreas
    }

    const [curRowStart, curColStart, curRowEnd, curColEnd] = gridAreas[
        startIndex
    ].gridArea
        .split('/')
        .map((el) => +el)
    const currentPosition = [curRowStart, curColStart, curRowEnd, curColEnd]
    const updatedPosition = [
        curRowStart,
        curColStart + increaseBy,
        curRowEnd,
        curColEnd + increaseBy,
    ]

    if (
        isOverlapping(updatedElement, [
            curRowStart,
            curColStart,
            curRowEnd,
            curColEnd,
        ]) ||
        shouldShift
    ) {
        if (updatedPosition[3] > MAX_COLUMN + 1) {
            updatedPosition[3] = MAX_COLUMN + 1
            updatedPosition[1] = MAX_COLUMN + 1 - (curColEnd - curColStart)
        }

        gridAreas[startIndex].gridArea = updatedPosition.join('/')
        return shiftElements(
            gridAreas,
            startIndex + 1,
            updatedElement,
            increaseBy,
            true
        )
    } else {
        return shiftElements(
            gridAreas,
            startIndex + 1,
            updatedElement,
            0,
            false
        )
    }
}

function canShiftElements(
    gridAreas: ItemTypeWithOrder[],
    indexToUpdate: number,
    increaseBy: number,
    affectedItems: number[] = []
): boolean {
    // const [rowStart, colStart, rowEnd, colEnd] = gridAreas[indexToUpdate]
    //     .split('/')
    //     .map((el) => +el)
    //
    // const updatedColEnd = colEnd + increaseBy
    //
    // for (let i = indexToUpdate + 1; i < gridAreas.length; i++) {
    //     const [otherRowStart, otherColStart, otherRowEnd, otherColEnd] =
    //         gridAreas[i].split('/').map((el) => +el)
    //
    //     if (
    //         rowEnd > otherRowStart &&
    //         rowStart < otherRowEnd &&
    //         otherColStart < updatedColEnd
    //     ) {
    //         const remainingColumns = MAX_COLUMN + 1 - otherColEnd
    //         if (remainingColumns <= increaseBy) {
    //             return false
    //         }
    //     }
    // }
    //
    // return true

    const [rowStart, colStart, rowEnd, colEnd] = gridAreas[
        indexToUpdate
    ].gridArea
        .split('/')
        .map((el) => +el)

    const updatedColEnd = colEnd + increaseBy
    affectedItems.push(indexToUpdate)

    for (let i = indexToUpdate + 1; i < gridAreas.length; i++) {
        let [otherRowStart, otherColStart, otherRowEnd, otherColEnd] =
            gridAreas[i].gridArea.split('/').map((el) => +el)

        const intersects =
            (otherRowStart >= rowStart && otherRowStart < rowEnd) ||
            (otherRowEnd > rowStart && otherRowEnd <= rowEnd) ||
            affectedItems.includes(i)

        if (intersects) {
            const remainingColumns = MAX_COLUMN + 1 - otherColEnd
            if (remainingColumns < increaseBy) {
                const neededColumns = increaseBy - remainingColumns
                if (
                    !canShiftElements(
                        gridAreas,
                        i,
                        neededColumns,
                        affectedItems
                    )
                ) {
                    return false
                }
            } else {
                otherColStart += increaseBy
                otherColEnd += increaseBy
                if (!affectedItems.includes(i)) {
                    affectedItems.push(i)
                }
            }
        }
    }

    return true
}

export function updateGridAreas(
    gridAreas: ItemTypeWithOrder[],
    indexToUpdate: number,
    increaseBy: number
): ItemTypeWithOrder[] {
    // todo работает без ограничения по колонкам и минимальному размеру
    // const updatedGridAreas = [...gridAreas]
    //
    // const [rowStart, colStart, rowEnd, colEnd] = gridAreas[
    //     indexToUpdate
    // ].gridArea
    //     .split('/')
    //     .map((el) => +el)
    //
    // if (colEnd + increaseBy > MAX_COLUMN + 1) {
    //     return gridAreas
    // }
    //
    // // Увеличиваем размер элемента на указанное количество колонок
    // const updatedColEnd = colEnd + increaseBy
    // updatedGridAreas[
    //     indexToUpdate
    // ].gridArea = `${rowStart}/${colStart}/${rowEnd}/${updatedColEnd}`
    //
    // const shiftedGridAreas = shiftElements(
    //     updatedGridAreas,
    //     indexToUpdate + 1,
    //     [rowStart, colStart, rowEnd, updatedColEnd],
    //     increaseBy,
    //     false
    // )
    // const allElementsHaveMinSize = shiftedGridAreas.every((gridArea) => {
    //     const [_, start, __, end] = gridArea.gridArea.split('/').map(Number)
    //     return end - start >= MIN_COLUMN
    // })
    //
    // if (allElementsHaveMinSize) {
    //     return shiftedGridAreas
    // } else {
    //     return gridAreas
    // }
    //todo рабочий код только меняет напрямую без копии
    // if (!canShiftElements(gridAreas, indexToUpdate, increaseBy)) {
    //     return gridAreas
    // }
    //
    // const updatedGridAreas = [...gridAreas]
    //
    // const [rowStart, colStart, rowEnd, colEnd] = gridAreas[
    //     indexToUpdate
    // ].gridArea
    //     .split('/')
    //     .map((el) => +el)
    //
    // if (colEnd + increaseBy > MAX_COLUMN + 1) {
    //     return gridAreas
    // }
    //
    // const updatedColEnd = colEnd + increaseBy
    // updatedGridAreas[
    //     indexToUpdate
    // ].gridArea = `${rowStart}/${colStart}/${rowEnd}/${updatedColEnd}`
    //
    // const shiftedGridAreas = shiftElements(
    //     updatedGridAreas,
    //     indexToUpdate + 1,
    //     [rowStart, colStart, rowEnd, updatedColEnd],
    //     increaseBy,
    //     false
    // )
    // const allElementsHaveMinSize = shiftedGridAreas.every((el) => {
    //     const [_, start, __, end] = el.gridArea.split('/').map(Number)
    //     return end - start >= MIN_COLUMN
    // })
    //
    // if (allElementsHaveMinSize) {
    //     return shiftedGridAreas
    // } else {
    //     return gridAreas
    // }
    // // if (indexToUpdate < 0 || indexToUpdate >= items.length) {
    // //     return items
    // // }
    // //
    // // const updatedItems = items.map((item) => ({ ...item }))
    // // const currentItem = updatedItems[indexToUpdate]
    // //
    // // const [rowStart, colStart, rowEnd, colEnd] = currentItem.gridArea
    // //     .split('/')
    // //     .map((el) => +el)
    // //
    // // if (colEnd + increaseBy > MAX_COLUMN + 1) {
    // //     return items
    // // }
    // //
    // // if (!canShiftElements(items, indexToUpdate, increaseBy)) {
    // //     return items
    // // }
    // //
    // // currentItem.gridArea = `${rowStart}/${colStart}/${rowEnd}/${
    // //     colEnd + increaseBy
    // // }`
    // //
    // // for (let i = indexToUpdate + 1; i < updatedItems.length; i++) {
    // //     const current = updatedItems[i]
    // //     const [curRowStart, curColStart, curRowEnd, curColEnd] =
    // //         current.gridArea.split('/').map((el) => +el)
    // //
    // //     if (
    // //         rowEnd > curRowStart &&
    // //         rowStart < curRowEnd &&
    // //         curColStart < colEnd + increaseBy
    // //     ) {
    // //         const remainingColumns = MAX_COLUMN + 1 - curColEnd
    // //         const neededColumns = increaseBy - remainingColumns
    // //         if (neededColumns > 0) {
    // //             const shiftedGridArea = updateGridAreas(
    // //                 updatedItems,
    // //                 i,
    // //                 neededColumns
    // //             )
    // //             if (shiftedGridArea !== items) {
    // //                 updatedItems[i].gridArea = shiftedGridArea[i].gridArea
    // //                 console.log(
    // //                     'updatedItems[i].gridArea',
    // //                     updatedItems[i].gridArea
    // //                 )
    // //             }
    // //         }
    // //     }
    // // }
    // //
    // // return updatedItems
    //
    // // if (indexToUpdate < 0 || indexToUpdate >= items.length) {
    // //     return items
    // // }
    // //
    // // if (!canShiftElements(items, indexToUpdate, increaseBy)) {
    // //     return items
    // // }
    // //
    // // const updatedItems = items.map((item) => ({ ...item }))
    // // const currentItem = updatedItems[indexToUpdate]
    // //
    // // const [rowStart, colStart, rowEnd, colEnd] = currentItem.gridArea
    // //     .split('/')
    // //     .map((el) => +el)
    // //
    // // if (colEnd + increaseBy > MAX_COLUMN + 1) {
    // //     return items
    // // }
    // //
    // // currentItem.gridArea = `${rowStart}/${colStart}/${rowEnd}/${
    // //     colEnd + increaseBy
    // // }`
    // //
    // // for (let i = indexToUpdate + 1; i < updatedItems.length; i++) {
    // //     const current = updatedItems[i]
    // //     const [curRowStart, curColStart, curRowEnd, curColEnd] =
    // //         current.gridArea.split('/').map((el) => +el)
    // //
    // //     if (
    // //         rowEnd > curRowStart &&
    // //         rowStart < curRowEnd &&
    // //         curColStart <= colEnd + increaseBy
    // //     ) {
    // //         const remainingColumns = MAX_COLUMN + 1 - curColEnd
    // //         const neededColumns = increaseBy - remainingColumns
    // //         if (neededColumns > 0) {
    // //             const shiftedGridArea = updateGridAreas(
    // //                 [...updatedItems],
    // //                 i,
    // //                 neededColumns
    // //             )
    // //             if (shiftedGridArea !== items) {
    // //                 updatedItems[i] = { ...shiftedGridArea[i] }
    // //             }
    // //         } else {
    // //             // Смещаем элемент на необходимое количество колонок
    // //             current.gridArea = `${curRowStart}/${
    // //                 curColStart + increaseBy
    // //             }/${curRowEnd}/${curColEnd + increaseBy}`
    // //         }
    // //     }
    // // }
    // //
    // // return updatedItems

    const copyGrid = getClone(gridAreas)
    const currentEl = copyGrid[indexToUpdate]
    if (currentEl === undefined) {
        console.error('NOT FOUND')
        return copyGrid
    }

    const [curRowStart, curColStart, curRowEnd, curColEnd] = getGridAreaValues(
        currentEl.gridArea
    )
    console.log('GRID_AREA =>', currentEl.gridArea)
    const newGridArea = `${curRowStart}/${curColStart}/${curRowEnd}/${
        curColEnd + increaseBy
    }`
    currentEl.gridArea = newGridArea

    const allWithoutLeftElements = copyGrid
        .filter((el) => !(el.id === currentEl.id))
        .filter((el, index) => {
            const [rowStart, colStart, rowEnd, colEnd] = getGridAreaValues(
                el.gridArea
            )
            return colStart >= curColEnd
        })

    let initRowStart = curRowStart
    let initRowEnd = curRowEnd

    const allWithoutCrossedElements = allWithoutLeftElements.filter((el) => {
        let [rowStart, colStart, rowEnd, colEnd] = getGridAreaValues(
            el.gridArea
        )
        //console.log('initRowStart', initRowStart)
        //console.log('initRowEnd', initRowEnd)

        if (initRowStart > rowStart) {
            //увеличиваем диапозон вверх
            initRowStart = rowStart
            return true
        }

        if (initRowStart === rowStart && rowEnd <= initRowEnd) {
            return true
        }

        if (initRowEnd < rowEnd) {
            if (rowStart >= initRowEnd) {
                return false
            }
            initRowEnd = rowEnd
        }
        if (initRowEnd >= rowEnd && rowStart >= initRowStart) {
            //увеличиваем диапозон вниз
            return true
        }
        return false
    })
    console.log(
        'allWithoutCrossedElements',
        allWithoutCrossedElements.map((el) => el.gridArea)
    )
    // console.log(
    //     'allWithoutCrossedElements',
    //     allWithoutCrossedElements.map((el) => el.gridArea)
    // )
    // const result: ItemTypeWithOrder[] = []
    // for (let i = 0; i < allWithoutCrossedElements.length; i++) {
    //     let [rowStart, colStart, rowEnd, colEnd] = getGridAreaValues(
    //         allWithoutCrossedElements[i].gridArea
    //     )
    //     console.log('colEnd=>', colEnd)
    //     for (let j = i + 1; j < allWithoutCrossedElements.length; j++) {
    //         let [rowStart_, colStart_, rowEnd_, colEnd_] = getGridAreaValues(
    //             allWithoutCrossedElements[i].gridArea
    //         )
    //         console.log('colStart_=>', colStart_)
    //     }
    // }
    let newCurEndCol = curColEnd + increaseBy
    const up = allWithoutCrossedElements.map((el, index, array) => {
        console.log('curRowEnd', curColEnd)
        //console.log('el', el)
        //console.log('index', index)
        //console.log('array', array)
    })
    // const allElementsWithUpdateGridAreas = allWithoutLeftElements.map((el) => {
    //     const isNeededItem = false
    //     let [rowStart, colStart, rowEnd, colEnd] = getGridAreaValues(
    //         el.gridArea
    //     )
    //
    //     //логика для увеличения гридушек
    //     const newColStart = colStart + increaseBy
    //     const newColEnd = colEnd + increaseBy
    //     const newGridArea = `${rowStart}/${newColStart}/${rowEnd}/${newColEnd}`
    //     return { ...el, gridArea: newGridArea }
    // })

    // copyGrid.forEach((el) => {
    //     const element = allElementsWithUpdateGridAreas.find(
    //         (ell) => ell.id === el.id
    //     )
    //     if (element) {
    //         console.log('el', element)
    //         el.gridArea = element.gridArea
    //     }
    // })

    return copyGrid
}
