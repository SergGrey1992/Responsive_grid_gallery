import { ItemTypeWithOrder } from '../types/types'

import {
    getGridAreaCurrentValues,
    getGridAreaValues,
} from './getGridAreaValues'

// export function updateGridArea(
//     gridData: ItemTypeWithOrder[],
//     id: string,
//     increaseValue: number
// ): ItemTypeWithOrder[] | undefined {
//     const updatedGridData = [...gridData]
//     const itemIndex = gridData.findIndex((item) => item.id === id)
//
//     if (itemIndex >= 0) {
//         const item = gridData[itemIndex]
//         const [, startColumn, , endColumn] = item.gridArea
//             .split('/')
//             .map(Number)
//
//         // Увеличиваем gridArea выбранного элемента на increaseValue
//         const newEndColumn = endColumn + increaseValue
//         updatedGridData[
//             itemIndex
//         ].gridArea = `1/${startColumn}/1/${newEndColumn}`
//
//         // Увеличиваем gridArea последующих элементов, которые соприкасаются с увеличенным элементом
//         let prevEndColumn = newEndColumn
//
//         for (let i = itemIndex + 1; i < gridData.length; i++) {
//             const [, currStartColumn, , currEndColumn] = updatedGridData[
//                 i
//             ].gridArea
//                 .split('/')
//                 .map(Number)
//
//             if (prevEndColumn >= currStartColumn) {
//                 const newStartColumn = prevEndColumn + 1
//                 const newEndColumn = Math.min(
//                     currEndColumn + (newStartColumn - currStartColumn),
//                     61
//                 )
//                 updatedGridData[
//                     i
//                 ].gridArea = `1/${newStartColumn}/1/${newEndColumn}`
//                 prevEndColumn = newEndColumn
//
//                 if (newEndColumn === 61) {
//                     // Уменьшаем размер от последнего элемента к увеличиваемому на 1
//                     for (let j = i - 1; j > itemIndex; j--) {
//                         const [, prevStartColumn, , prevEndColumn] =
//                             updatedGridData[j].gridArea.split('/').map(Number)
//                         const [, nextStartColumn, , nextEndColumn] =
//                             updatedGridData[j + 1].gridArea
//                                 .split('/')
//                                 .map(Number)
//                         if (nextEndColumn - prevEndColumn === 1) {
//                             const newEndColumn = prevEndColumn - 1
//                             updatedGridData[
//                                 j
//                             ].gridArea = `1/${prevStartColumn}/1/${newEndColumn}`
//                         }
//                     }
//                     break
//                 }
//             } else {
//                 break
//             }
//         }
//     }
//
//     return updatedGridData
// }
export function updateGridArea(
    gridData: ItemTypeWithOrder[],
    id: string,
    increaseValue: number
): ItemTypeWithOrder[] | undefined {
    const updatedGridData = [...gridData]
    const itemIndex = updatedGridData.findIndex((item) => item.id === id)
    if (itemIndex === -1) return

    //увеличение элемента
    //нашли конкретный элемент по индексу
    let targetElement = updatedGridData[itemIndex]
    //по его gridArea по лучили массив из значений
    let targetGridArea = targetElement.gridArea.split('/')
    //увеличили его последнюю строку и записали в переменную targetNewEndColumn
    let targetNewEndColumn = Number(targetGridArea[3]) + increaseValue
    //перезаписываем на новое значение в gridArea
    targetGridArea[3] = targetNewEndColumn.toString()
    //делает строку gridArea
    targetElement.gridArea = targetGridArea.join('/')

    //
    //надо пробежаться по всем элементам в строке и проверить соприкосаются они или нет
    //itemIndex + 1 начинам со следующего и бежим до последнего updatedGridData.length
    for (let i = itemIndex + 1; i < updatedGridData.length; i++) {
        const currentSizeGridArea = getGridAreaCurrentValues(
            getGridAreaValues(updatedGridData[itemIndex].gridArea),
            [1, 3]
        )
        const deff = currentSizeGridArea[1] - currentSizeGridArea[0]
        console.log('deff', i, deff)
    }

    return updatedGridData
}

//    if (itemIndex >= 0) {
//         const item = gridData[itemIndex]
//         const [, startColumn, , endColumn] = item.gridArea
//             .split('/')
//             .map(Number)
//
//         // Увеличиваем gridArea выбранного элемента на increaseValue
//         const newEndColumn = endColumn + increaseValue
//         updatedGridData[
//             itemIndex
//         ].gridArea = `1/${startColumn}/1/${newEndColumn}`
//
//         // Увеличиваем gridArea последующих элементов, которые соприкасаются с увеличенным элементом
//         let prevEndColumn = newEndColumn
//
//         for (let i = itemIndex + 1; i < gridData.length; i++) {
//             const [, currStartColumn, , currEndColumn] = updatedGridData[
//                 i
//             ].gridArea
//                 .split('/')
//                 .map(Number)
//
//             if (prevEndColumn >= currStartColumn) {
//                 const newStartColumn = prevEndColumn + 1
//                 const newEndColumn = Math.min(
//                     currEndColumn + (newStartColumn - currStartColumn),
//                     61
//                 )
//                 updatedGridData[
//                     i
//                 ].gridArea = `1/${newStartColumn}/1/${newEndColumn}`
//                 prevEndColumn = newEndColumn
//             } else {
//                 break
//             }
//         }
//
//         // Уменьшаем последующие элементы справа налево от последнего элемента к увеличиваемому элементу
//         // let decreaseValue = increaseValue
//         // for (
//         //     let i = gridData.length - 1;
//         //     i > itemIndex && decreaseValue > 0;
//         //     i--
//         // ) {
//         //     const [, prevStartColumn, , prevEndColumn] = updatedGridData[
//         //         i
//         //     ].gridArea
//         //         .split('/')
//         //         .map(Number)
//         //     const columnRange = prevEndColumn - prevStartColumn
//         //
//         //     if (columnRange > 10) {
//         //         const shrink = Math.min(decreaseValue, columnRange - 10)
//         //         const newEndColumn = prevEndColumn - shrink
//         //         updatedGridData[
//         //             i
//         //         ].gridArea = `1/${prevStartColumn}/1/${newEndColumn}`
//         //         decreaseValue -= shrink
//         //     }
//         // }
//     }
