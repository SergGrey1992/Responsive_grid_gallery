import { ItemTypeWithOrder } from '../types/types'

type GridData = {
    [p: string]: ItemTypeWithOrder[]
}

export const createGridFromState = (
    gridAreas: GridData
): (string | null)[][] => {
    const grid: (string | null)[][] = Array(Object.keys(gridAreas).length)
        .fill(null)
        .map(() => Array(60).fill(null))

    Object.values(gridAreas).forEach((items) => {
        items.forEach((item, index) => {
            const [rowStart, colStart, rowEnd, colEnd] = item.gridArea
                .split('/')
                .map(Number)
            for (let row = rowStart; row < rowEnd; row++) {
                for (let col = colStart; col < colEnd; col++) {
                    grid[row - 1][col - 1] = item.id
                }
            }
        })
    })

    // fullGridElements.forEach((object, index) => {
    //     const [rowStart, colStart, rowEnd, colEnd] = object.gridArea
    //         .split('/')
    //         .map(Number)
    //
    //     for (let row = rowStart; row < rowEnd; row++) {
    //         for (let col = colStart; col < colEnd; col++) {
    //             grid[row - 1][col - 1] = index // мы отнимаем 1, потому что индексы в JavaScript начинаются с 0
    //         }
    //     }
    // })

    return grid
}
// рабочее
export function expandAndShift(
    itemId: string,
    increaseBy: number,
    objects: GridData
): GridData {
    const newObjects: GridData = JSON.parse(JSON.stringify(objects))

    let itemToExpand: ItemTypeWithOrder | null = null //элемент для уввеличения

    for (const rowId in newObjects) {
        const item = newObjects[rowId].find((item) => item.id === itemId)
        if (item) {
            itemToExpand = item
        }
        if (itemToExpand) break
    }

    if (!itemToExpand) return objects

    const [rowStart, colStart, rowEnd, colEnd] = itemToExpand.gridArea
        .split('/')
        .map(Number)

    // Check if the new size is within the limits (min 10 columns, max 60 columns)
    if (colEnd + increaseBy - colStart < 10 || colEnd + increaseBy > 61) {
        return objects
    }

    // itemToExpand.gridArea = `${rowStart}/${colStart}/${rowEnd}/${
    //     colEnd + increaseBy
    // }`

    let grid = createGridFromState(newObjects)

    let incrementEndRow = rowEnd

    for (let row = rowStart; row < incrementEndRow; row++) {
        //console.log('row=>', row)
        //пробегаемся по каждой СТРОКЕ
        for (let col = colEnd; col < colEnd + increaseBy; col++) {
            //пробегаемся по каждой КОЛОНКЕ
            //console.log('col', col)
            const overlappingItemId = grid[row][col]
            console.log('overlappingItemId', overlappingItemId)
            // const overlappingItemId = grid[row - 1][col]
            //console.log('overlappingItemId', overlappingItemId)
            // if (overlappingItemId !== null && overlappingItemId !== itemId) {
            //     for (const rowId in newObjects) {
            //         const overlappingItem = newObjects[rowId].find(
            //             (item) => item.id === overlappingItemId
            //         )
            //         if (overlappingItem) {
            //             const [oRowStart, oColStart, oRowEnd, oColEnd] =
            //                 overlappingItem.gridArea.split('/').map(Number)
            //             const shiftBy = Math.max(
            //                 colEnd + increaseBy - oColStart,
            //                 0
            //             )
            //             if (oColEnd + shiftBy > 61) {
            //                 // Return the original objects without changes if shifting causes overlapping items to go out of bounds
            //                 return objects
            //             }
            //             overlappingItem.gridArea = `${oRowStart}/${
            //                 oColStart + shiftBy
            //             }/${oRowEnd}/${oColEnd + shiftBy}`
            //             break
            //         }
            //     }
            // }
        }
        if (row === 2) {
            incrementEndRow = incrementEndRow += 1
        }
    }
    return newObjects
}

// function findOverlappingItems(
//     expandItemId: string,
//     objects: GridData
// ): ItemTypeWithOrder[] {
//     const overlappingItems: ItemTypeWithOrder[] = []
//
//     let itemToExpand: ItemTypeWithOrder | null = null
//
//     for (const rowId in objects) {
//         const item = objects[rowId].find((item) => item.id === expandItemId)
//         if (item) {
//             itemToExpand = item
//         }
//         if (itemToExpand) break
//     }
//
//     if (!itemToExpand) return overlappingItems
//
//     const [rowStart, colStart, rowEnd, colEnd] = itemToExpand.gridArea
//         .split('/')
//         .map(Number)
//
//     const sortedObjects = Object.values(objects)
//         .flat()
//         .sort((a, b) => {
//             const [aRowStart, aColStart] = a.gridArea.split('/').map(Number)
//             const [bRowStart, bColStart] = b.gridArea.split('/').map(Number)
//             return aRowStart - bRowStart || aColStart - bColStart
//         })
//         //все элементы которые справа от увеличиваемого
//         .filter((el) => {
//             const [cRowStart, cColStart, cRowEnd, cColEnd] = el.gridArea
//                 .split('/')
//                 .map(Number)
//             return !(el.id === expandItemId) && colEnd <= cColStart
//         })
//     //console.log('sortedObjects', sortedObjects)
//     let currentEnd = rowEnd
//     const arrTest: ItemTypeWithOrder[] = []
//     for (let i = 0; i < sortedObjects.length; i++) {
//         const currentItem = sortedObjects[i]
//         const [curRowStart, curColStart, curRowEnd, curColEnd] =
//             currentItem.gridArea.split('/').map(Number)
//         // const nextItem = sortedObjects[i + 1]
//         // const [nextRowStart, nextColStart, nextRowEnd, nextColEnd] =
//         //     nextItem.gridArea.split('/').map(Number)
//         console.log('currentItem\n', currentItem.gridArea)
//         const next = sortedObjects.slice(i, sortedObjects.length)
//         console.log('next', next)
//     }
//
//     // while (currentRow <= rowEnd) {
//     //     for (let i = 0; i < sortedObjects.length; i++) {
//     //         const item = sortedObjects[i]
//     //         const [itemRowStart, itemColStart, itemRowEnd, itemColEnd] =
//     //             item.gridArea.split('/').map(Number)
//     //
//     //         if (itemRowStart === currentRow && itemColStart >= colEnd) {
//     //             overlappingItems.push(item)
//     //             if (itemRowEnd > currentRow) {
//     //                 currentRow = itemRowEnd
//     //                 break
//     //             }
//     //         }
//     //     }
//     //     currentRow++
//     // }
//
//     return overlappingItems
// }
//
// // function findOverlappingItems(
// //     itemId: string,
// //     objects: GridData
// // ): ItemTypeWithOrder[] {
// //     const overlappingItems: ItemTypeWithOrder[] = []
// //     const itemsToProcess: ItemTypeWithOrder[] = [
// //         objects.row1.find((item) => item.id === itemId) as ItemTypeWithOrder,
// //     ]
// //     while (itemsToProcess.length > 0) {
// //         const currentItem = itemsToProcess.pop() as ItemTypeWithOrder
// //         const [currentRowStart, , currentRowEnd, currentColEnd] =
// //             currentItem.gridArea.split('/').map(Number)
// //         for (const row in objects) {
// //             for (const item of objects[row as keyof GridData]) {
// //                 const [itemRowStart, itemColStart, ,] = item.gridArea
// //                     .split('/')
// //                     .map(Number)
// //                 if (
// //                     itemRowStart >= currentRowStart &&
// //                     itemColStart >= currentColEnd &&
// //                     !overlappingItems.find(
// //                         (overlappingItem) => overlappingItem.id === item.id
// //                     )
// //                 ) {
// //                     itemsToProcess.push(item)
// //                     overlappingItems.push(item)
// //                 }
// //             }
// //         }
// //     }
// //     return overlappingItems
// // }
//
// const objects: any = {
//     row1: [
//         { id: '1', gridArea: '1/1/2/11' },
//         { id: '2', gridArea: '1/11/3/21' },
//         { id: '3', gridArea: '1/21/2/31' },
//     ],
//     row2: [
//         { id: '4', gridArea: '2/21/4/31' },
//         { id: '5', gridArea: '2/31/3/41' },
//     ],
//     row3: [
//         { id: '6', gridArea: '3/31/4/41' },
//         { id: '7', gridArea: '3/41/4/51' },
//     ],
//
//     row4: [{ id: '8', gridArea: '4/41/5/51' }],
// }
//
// const expandItemId = '2'
// const overlappingItems = findOverlappingItems(expandItemId, objects)
//
// console.log('overlappingItems\n', overlappingItems)

// function findOverlappingItems(
//     itemId: string,
//     objects: GridData
// ): ItemTypeWithOrder[] {
//     const overlappingItems: ItemTypeWithOrder[] = []
//     const itemToExpand = objects.row1.find(
//         (item) => item.id === itemId
//     ) as ItemTypeWithOrder
//     const [initialRowStart, , initialRowEnd, initialColEnd] =
//         itemToExpand.gridArea.split('/').map(Number)
//     let rowStart = initialRowStart
//     let rowEnd = initialRowEnd
//
//     for (let col = initialColEnd; col <= 60; col++) {
//         for (let row = 1; row <= 60; row++) {
//             for (const item of Object.values(objects).flat()) {
//                 const [itemRowStart, itemColStart, itemRowEnd] = item.gridArea
//                     .split('/')
//                     .map(Number)
//                 if (
//                     (itemColStart === col &&
//                         itemRowStart >= rowStart &&
//                         itemRowStart <= rowEnd) ||
//                     (itemRowStart === row &&
//                         itemColStart <= initialColEnd &&
//                         itemColStart >= rowStart)
//                 ) {
//                     overlappingItems.push(item)
//                     if (itemRowEnd > rowEnd) {
//                         rowEnd = itemRowEnd
//                     }
//                     if (itemRowStart < rowStart) {
//                         rowStart = itemRowStart
//                     }
//                 }
//             }
//         }
//     }
//     return overlappingItems
// }

function expandElement(objects: any, expandId: string, delta: number) {
    const clonedObjects = JSON.parse(JSON.stringify(objects)) // Создаем копию объекта
    let expandRow = ''
    let expandObject = null
    let expandEndCol = 0
    const resultObjects: any = {}

    // Находим элемент для расширения и его строку
    for (const key in clonedObjects) {
        for (let i = 0; i < clonedObjects[key].length; i++) {
            if (clonedObjects[key][i].id === expandId) {
                expandObject = clonedObjects[key][i]
                const gridArea = expandObject.gridArea.split('/').map(Number)
                expandEndCol = gridArea[3]
                expandRow = key
                break
            }
        }
    }

    if (!expandObject) {
        console.error(`Элемент с id ${expandId} не найден`)
        return
    }

    // Увеличиваем размер элемента
    const gridArea = expandObject.gridArea.split('/').map(Number)
    expandObject.gridArea = `${gridArea[0]}/${gridArea[1]}/${gridArea[2]}/${
        expandEndCol + delta
    }`

    let currentRow = expandRow
    while (currentRow && clonedObjects[currentRow]) {
        // Добавляем все элементы текущей строки в результат и удаляем из клонированного объекта
        resultObjects[currentRow] = clonedObjects[currentRow]
        delete clonedObjects[currentRow]

        // Находим следующую строку, если есть элемент, который занимает более одной строки
        currentRow = ''
        for (const obj of resultObjects[expandRow]) {
            const objGridArea = obj.gridArea.split('/').map(Number)
            if (objGridArea[2] > gridArea[2]) {
                currentRow = 'row' + objGridArea[2]
                break
            }
        }
    }

    // Добавляем оставшиеся элементы в результат
    for (const key in clonedObjects) {
        resultObjects[key] = clonedObjects[key]
    }

    return resultObjects
}

const objects1: any = {
    row1: [
        { id: '1', gridArea: '1/1/2/11' },
        { id: '2', gridArea: '1/11/2/21' },
        { id: '3', gridArea: '1/41/2/51' },
    ],
    row2: [
        { id: '4', gridArea: '2/21/4/31' },
        { id: '5', gridArea: '1/31/3/41' },
    ],
    row3: [
        { id: '6', gridArea: '3/31/4/41' },
        { id: '7', gridArea: '3/41/4/51' },
    ],
    row4: [{ id: '8', gridArea: '4/41/5/51' }],
}
const objects: any = {
    row1: [
        { id: '1', gridArea: '1/1/2/11' },
        { id: '2', gridArea: '1/11/3/21' },
        { id: '3', gridArea: '1/21/2/31' },
    ],
    row2: [
        { id: '4', gridArea: '2/21/4/31' },
        { id: '5', gridArea: '2/31/3/41' },
    ],
    row3: [
        { id: '6', gridArea: '3/31/4/41' },
        { id: '7', gridArea: '3/41/4/51' },
    ],
    row4: [{ id: '8', gridArea: '4/41/5/51' }],
}
console.log('prev result=>', objects)
const result = expandElement(objects, '2', 10)
console.log('result', result)
