import { ItemTypeWithOrder } from '../types/types'

import { FullGridElementsType } from './getAllGridElements'
import { getClone } from './getClone'
import { getGridAreaValues } from './getGridAreaValues'

export function updateGridAreas(
    gridAreas: FullGridElementsType[],
    idToUpdate: string,
    increaseBy: number
): { [key: string]: ItemTypeWithOrder[] } | undefined {
    const copyGrid = getClone(gridAreas)

    console.log(copyGrid, 'copyGrid')

    const currentEl = copyGrid.find((grid) => grid.id === idToUpdate)

    if (currentEl === undefined) {
        console.error('NOT FOUND')
        return
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
        .filter((el) => {
            const [rowStart, colStart, rowEnd, colEnd] = getGridAreaValues(
                el.gridArea
            )
            return colStart >= curColEnd
        })

    let initRowStart = curRowStart
    let initRowEnd = curRowEnd

    const allWithCrossedElements = allWithoutLeftElements.filter((el) => {
        let [rowStart, colStart, rowEnd, colEnd] = getGridAreaValues(
            el.gridArea
        )

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
        return initRowEnd >= rowEnd && rowStart >= initRowStart
    })
    console.log(
        'allWithCrossedElements',
        allWithCrossedElements.map((el) => el.gridArea)
    )

    let result: any = []

    let fsfs: any = {}

    allWithCrossedElements.forEach((el) => {
        let [rowStart, colStart, rowEnd, colEnd] = getGridAreaValues(
            el.gridArea
        )

        if (
            fsfs[rowStart] &&
            fsfs[rowStart].items.find((i: any) => i.id === el.id)
        ) {
            return
        }

        if (fsfs[rowStart] && fsfs[rowStart].items.length) {
            fsfs[rowStart] = {
                curColEnd: curColEnd,
                items: [...fsfs[rowStart].items, el],
            }
        } else {
            const peresechenie = allWithCrossedElements.find((c) => {
                let [rowStart1, colStart1, rowEnd1, colEnd1] =
                    getGridAreaValues(c.gridArea)

                if (rowEnd1 >= rowEnd && rowStart >= rowStart1) {
                    return true
                }
            })
            if (peresechenie) {
                if (peresechenie.gridArea === el.gridArea) {
                    fsfs[rowStart] = {
                        curColEnd: curColEnd,
                        items: [el],
                    }
                } else {
                    fsfs[rowStart] = {
                        curColEnd: curColEnd,
                        items: [peresechenie, el],
                    }
                }
            } else {
                fsfs[rowStart] = {
                    curColEnd: curColEnd,
                    items: [el],
                }
            }
        }
    })

    console.log(fsfs, 'fsfs')
    Object.keys(fsfs).map((el) => {
        for (let i = 0; i < fsfs[el].items.length; i++) {
            let [rowStart, colStart, rowEnd, colEnd] = getGridAreaValues(
                fsfs[el].items[i].gridArea
            )

            if (fsfs[rowStart].curColEnd < colStart) {
                continue
            }

            colStart += increaseBy
            colEnd += increaseBy

            const newGridArea = `${rowStart}/${colStart}/${rowEnd}/${colEnd}`

            const rwr = result.find(
                (el: any) => el.id === fsfs[rowStart].items[i].id
            )

            if (rwr) {
                // result = result.map((res: any) =>
                //     res.id === fsfs[el].items[i].id
                //         ? { ...rwr, gridArea: newGridArea }
                //         : res
                // )
                continue
            } else {
                result.push({ ...fsfs[el].items[i], gridArea: newGridArea })
            }
            console.log('colEnd=>', colEnd)

            for (let i = 1; i <= rowEnd; i++) {
                if (fsfs[i]) {
                    fsfs[i].curColEnd = colEnd
                }
            }
            // fsfs[rowStart].curColEnd = colEnd
            //
            // const endCol = rowEnd - rowStart
            // console.log(endCol, ' endCol')
            // if (fsfs[endCol]) {
            //     fsfs[endCol].curColEnd = colEnd
            // }
        }
    })

    console.log(copyGrid, 'copyGrid')
    console.log(result, 'result')

    let obj: any = {}

    copyGrid.map((gridEl) => {
        console.log(gridEl, 'gridEl')
        const editedElement = result.find((el: any) => el.id === gridEl.id)
        console.log(editedElement, 'editedElement')

        if (editedElement) {
            if (obj[gridEl.rowKey] && obj[gridEl.rowKey].length) {
                obj[gridEl.rowKey] = [
                    ...obj[gridEl.rowKey],
                    {
                        order: editedElement.order,
                        gridArea: editedElement.gridArea,
                        type: editedElement.type,
                        id: editedElement.id,
                        url: editedElement.url,
                        backgroundColor: editedElement.backgroundColor,
                    },
                ]
            } else {
                obj[gridEl.rowKey] = [
                    {
                        order: editedElement.order,
                        gridArea: editedElement.gridArea,
                        type: editedElement.type,
                        id: editedElement.id,
                        url: editedElement.url,
                        backgroundColor: editedElement.backgroundColor,
                    },
                ]
            }
            return
        }

        if (gridEl.id === idToUpdate) {
            if (obj[gridEl.rowKey] && obj[gridEl.rowKey].length) {
                obj[gridEl.rowKey] = [
                    ...obj[gridEl.rowKey],
                    {
                        order: gridEl.order,
                        gridArea: newGridArea,
                        type: gridEl.type,
                        id: gridEl.id,
                        url: gridEl.url,
                        backgroundColor: gridEl.backgroundColor,
                    },
                ]
            } else {
                obj[gridEl.rowKey] = [
                    {
                        order: gridEl.order,
                        gridArea: newGridArea,
                        type: gridEl.type,
                        id: gridEl.id,
                        url: gridEl.url,
                        backgroundColor: gridEl.backgroundColor,
                    },
                ]
            }
            return
        }

        if (!editedElement && gridEl.id !== idToUpdate) {
            if (obj[gridEl.rowKey] && obj[gridEl.rowKey].length) {
                obj[gridEl.rowKey] = [
                    ...obj[gridEl.rowKey],
                    {
                        order: gridEl.order,
                        gridArea: gridEl.gridArea,
                        type: gridEl.type,
                        id: gridEl.id,
                        url: gridEl.url,
                        backgroundColor: gridEl.backgroundColor,
                    },
                ]
            } else {
                obj[gridEl.rowKey] = [
                    {
                        order: gridEl.order,
                        gridArea: gridEl.gridArea,
                        type: gridEl.type,
                        id: gridEl.id,
                        url: gridEl.url,
                        backgroundColor: gridEl.backgroundColor,
                    },
                ]
            }
            return
        }
    })

    return obj
}
