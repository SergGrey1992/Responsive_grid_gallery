import { ItemTypeWithOrder } from '../types/types'

export const updateGridArea_ = (
    array: ItemTypeWithOrder[],
    id: any,
    increaseValue: any
): ItemTypeWithOrder[] | undefined => {
    // const targetIndex = array.findIndex((obj) => obj.id === id)
    //
    // if (targetIndex === -1) {
    //     console.log('Объект с указанным ID не найден.')
    //     return
    // }
    //
    // for (let i = targetIndex; i < array.length; i++) {
    //     debugger
    //     const gridAreaParts = array[i].gridArea.split('/')
    //     if (i === targetIndex) {
    //         gridAreaParts[3] = (
    //             parseInt(gridAreaParts[3]) + increaseValue
    //         ).toString()
    //     } else {
    //         gridAreaParts[1] = (
    //             parseInt(gridAreaParts[1]) + increaseValue
    //         ).toString()
    //         gridAreaParts[3] = (
    //             parseInt(gridAreaParts[3]) + increaseValue
    //         ).toString()
    //     }
    //
    //     array[i].gridArea = gridAreaParts.join('/')
    // }
    //
    // return array

    let targetArray = array
    const targetIndex = targetArray.findIndex((obj) => obj.id === id)

    if (targetIndex === -1) {
        console.log('Объект с указанным ID не найден.')
        return
    }

    for (let i = targetIndex; i < targetArray.length; i++) {
        const gridAreaParts = targetArray[i].gridArea.split('/')

        if (i === targetIndex) {
            gridAreaParts[3] = (
                parseInt(gridAreaParts[3]) + increaseValue
            ).toString()
        } else {
            gridAreaParts[1] = (
                parseInt(gridAreaParts[1]) + increaseValue
            ).toString()
            gridAreaParts[3] = (
                parseInt(gridAreaParts[3]) + increaseValue
            ).toString()
        }
        targetArray[i].gridArea = gridAreaParts.join('/')
    }
    return targetArray
}

export const updateGridArea__ = (
    gridData: ItemTypeWithOrder[],
    id: string,
    increaseValue: number
): ItemTypeWithOrder[] | undefined => {
    const updatedGridData = [...gridData]
    const itemIndex = gridData.findIndex((item) => item.id === id)

    if (itemIndex >= 0) {
        const item = gridData[itemIndex]
        const [, startColumn, , endColumn] = item.gridArea
            .split('/')
            .map(Number)

        // Увеличиваем gridArea выбранного элемента
        const newEndColumn = endColumn + increaseValue
        updatedGridData[
            itemIndex
        ].gridArea = `1/${startColumn}/1/${newEndColumn}`

        // Если выбранный элемент соприкасается с другим элементом, увеличиваем gridArea следующих элементов
        if (itemIndex < gridData.length - 1) {
            const nextItem = gridData[itemIndex + 1]
            const [, nextStartColumn, , nextEndColumn] = nextItem.gridArea
                .split('/')
                .map(Number)

            if (newEndColumn >= nextStartColumn) {
                for (let i = itemIndex + 1; i < gridData.length; i++) {
                    const [, currStartColumn, , currEndColumn] =
                        updatedGridData[i].gridArea.split('/').map(Number)
                    const newStartColumn = currStartColumn + increaseValue
                    const newEndColumn = currEndColumn + increaseValue
                    updatedGridData[
                        i
                    ].gridArea = `1/${newStartColumn}/1/${newEndColumn}`
                }
            }
        }
    }

    return updatedGridData
}

export function updateGridArea(
    gridData: ItemTypeWithOrder[],
    id: string,
    increaseValue: number
): ItemTypeWithOrder[] | undefined {
    const updatedGridData = [...gridData]
    const itemIndex = gridData.findIndex((item) => item.id === id)

    if (itemIndex >= 0) {
        const item = gridData[itemIndex]
        const [, startColumn, , endColumn] = item.gridArea
            .split('/')
            .map(Number)

        // Увеличиваем gridArea выбранного элемента на increaseValue
        const newEndColumn = endColumn + increaseValue
        updatedGridData[
            itemIndex
        ].gridArea = `1/${startColumn}/1/${newEndColumn}`

        // Увеличиваем gridArea последующих элементов, которые соприкасаются с увеличенным элементом
        let prevEndColumn = newEndColumn

        for (let i = itemIndex + 1; i < gridData.length; i++) {
            const [, currStartColumn, , currEndColumn] = updatedGridData[
                i
            ].gridArea
                .split('/')
                .map(Number)

            if (prevEndColumn >= currStartColumn) {
                const newStartColumn = prevEndColumn + 1
                const newEndColumn = Math.min(
                    currEndColumn + (newStartColumn - currStartColumn),
                    61
                )
                updatedGridData[
                    i
                ].gridArea = `1/${newStartColumn}/1/${newEndColumn}`
                prevEndColumn = newEndColumn

                if (newEndColumn === 61) {
                    // Уменьшаем размер от последнего элемента к увеличиваемому на 1
                    for (let j = i - 1; j > itemIndex; j--) {
                        const [, prevStartColumn, , prevEndColumn] =
                            updatedGridData[j].gridArea.split('/').map(Number)
                        const [, nextStartColumn, , nextEndColumn] =
                            updatedGridData[j + 1].gridArea
                                .split('/')
                                .map(Number)
                        if (nextEndColumn - prevEndColumn === 1) {
                            const newEndColumn = prevEndColumn - 1
                            updatedGridData[
                                j
                            ].gridArea = `1/${prevStartColumn}/1/${newEndColumn}`
                        }
                    }
                    break
                }
            } else {
                break
            }
        }
    }

    return updatedGridData
}
