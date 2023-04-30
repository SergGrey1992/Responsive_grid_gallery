export const getGridAreaValues = (gridArea: string): number[] => {
    return gridArea.split('/').map((el) => +el)
    // console.log('arrValues', arrValues)
    // console.log(
    //     'arrValues',
    //     indexes.map((el, index) => arrValues[el])
    // )
}

export const getGridAreaCurrentValues = (
    values: number[],
    indexes: number[]
): number[] => {
    return indexes.map((el) => values[el])
}
