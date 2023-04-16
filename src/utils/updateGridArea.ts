import { ItemTypeWithOrder } from '../types/types'

export const updateGridArea = (
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
