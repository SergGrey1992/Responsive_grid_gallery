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

    const newGridArea = `${curRowStart}/${curColStart}/${curRowEnd}/${
        curColEnd + increaseBy
    }`
    currentEl.gridArea = newGridArea

    //получаем все элементы которые находятся справа от элемента который расширяется
    const allWithRightElements = copyGrid
        .filter((el) => !(el.id === currentEl.id))
        .filter((el) => {
            const [rowStart, colStart, rowEnd, colEnd] = getGridAreaValues(
                el.gridArea
            )
            return colStart >= curColEnd
        })

    let initRowStart = curRowStart
    let initRowEnd = curRowEnd

    const allWithCrossedElements = allWithRightElements.filter((el) => {
        let [rowStart, colStart, rowEnd, colEnd] = getGridAreaValues(
            el.gridArea
        )

        //todo fix this check
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

    let resultEditedElements: any = []

    let allElementsByRows: any = {}

    allWithCrossedElements.forEach((el) => {
        let [rowStart, colStart, rowEnd, colEnd] = getGridAreaValues(
            el.gridArea
        )

        if (
            allElementsByRows[rowStart] &&
            allElementsByRows[rowStart].items.find((i: any) => i.id === el.id)
        ) {
            return
        }

        if (
            allElementsByRows[rowStart] &&
            allElementsByRows[rowStart].items.length
        ) {
            allElementsByRows[rowStart] = {
                curColEnd: curColEnd,
                items: [...allElementsByRows[rowStart].items, el],
                resizeData: {
                    isFull: false,
                    canResizeIfFull: false,
                },
            }
        } else {
            const crossingElement = allWithCrossedElements.find((c) => {
                let [rowStart1, colStart1, rowEnd1, colEnd1] =
                    getGridAreaValues(c.gridArea)

                if (rowEnd1 >= rowEnd && rowStart >= rowStart1) {
                    return true
                }
            })
            if (crossingElement) {
                if (crossingElement.gridArea === el.gridArea) {
                    allElementsByRows[rowStart] = {
                        curColEnd: curColEnd,
                        items: [el],
                        resizeData: {
                            isFull: false,
                            canResizeIfFull: false,
                        },
                    }
                } else {
                    allElementsByRows[rowStart] = {
                        curColEnd: curColEnd,
                        items: [crossingElement, el],
                        resizeData: {
                            isFull: false,
                            canResizeIfFull: false,
                        },
                    }
                }
            } else {
                allElementsByRows[rowStart] = {
                    curColEnd: curColEnd,
                    items: [el],
                    isFull: false,
                }
            }
        }
    })

    let returned = false

    console.log(allElementsByRows, 'fsfs')
    Object.keys(allElementsByRows).map((el) => {
        const allRows = 60
        let initialRow = 0

        let resultRow = 0
        let elementsWeCanResize = []

        if (allElementsByRows[el].items.length) {
            allElementsByRows[el].items.map((element: any, index: number) => {
                let [rowStart, colStart, rowEnd, colEnd] = getGridAreaValues(
                    element.gridArea
                )

                if (index == 0) {
                    initialRow = colStart
                }

                const elementColumns = colEnd - colStart

                resultRow += elementColumns

                if (elementColumns > 10) {
                    elementsWeCanResize.push(element.gridArea)
                }
            })
        }

        const availableRows = allRows - initialRow

        if (availableRows - resultRow < 5) {
            allElementsByRows[el].resizeData.isFull = true

            if (elementsWeCanResize.length) {
                allElementsByRows[el].resizeData.canResizeIfFull = true
            }
        }

        for (let i = 0; i < allElementsByRows[el].items.length; i++) {
            let [rowStart, colStart, rowEnd, colEnd] = getGridAreaValues(
                allElementsByRows[el].items[i].gridArea
            )

            if (
                allElementsByRows[el].resizeData.isFull &&
                !allElementsByRows[el].resizeData.canResizeIfFull
            ) {
                returned = true
                return
            }

            if (allElementsByRows[rowStart].curColEnd < colStart) {
                continue
            }

            console.log(allElementsByRows[el].resizeData.isFull, 'isFull')
            console.log(
                allElementsByRows[el].resizeData.canResizeIfFull,
                'canResizeIfFull'
            )

            if (
                allElementsByRows[el].resizeData.isFull &&
                allElementsByRows[el].resizeData.canResizeIfFull
            ) {
                returned = false
                const canResizeElement = colEnd - colStart

                console.log(canResizeElement, 'canResizeElement')

                if (canResizeElement > 10) {
                    colStart = colStart + increaseBy

                    const newGridArea = `${rowStart}/${colStart}/${rowEnd}/${colEnd}`

                    const haveUpdatedElement = resultEditedElements.find(
                        (el: any) =>
                            el.id === allElementsByRows[rowStart].items[i].id
                    )

                    if (haveUpdatedElement) {
                        continue
                    } else {
                        resultEditedElements.push({
                            ...allElementsByRows[el].items[i],
                            gridArea: newGridArea,
                        })
                    }
                    console.log('colEnd=>', colEnd)

                    for (let i = 1; i <= rowEnd; i++) {
                        if (allElementsByRows[i]) {
                            allElementsByRows[i].curColEnd = colEnd
                        }
                    }

                    continue
                }
            }

            console.log(colEnd, 'colEnd')

            colEnd += increaseBy

            colStart += increaseBy

            const newGridArea = `${rowStart}/${colStart}/${rowEnd}/${colEnd}`

            const haveUpdatedElement = resultEditedElements.find(
                (el: any) => el.id === allElementsByRows[rowStart].items[i].id
            )

            if (haveUpdatedElement) {
                continue
            } else {
                resultEditedElements.push({
                    ...allElementsByRows[el].items[i],
                    gridArea: newGridArea,
                })
            }
            console.log('colEnd=>', colEnd)

            for (let i = 1; i <= rowEnd; i++) {
                if (allElementsByRows[i]) {
                    allElementsByRows[i].curColEnd = colEnd
                }
            }
        }
    })

    console.log(copyGrid, 'copyGrid')
    console.log(resultEditedElements, 'resultEditedElements')

    return prepareGridForSave(
        copyGrid,
        returned,
        resultEditedElements,
        idToUpdate,
        newGridArea
    )
}

const prepareGridForSave = (
    copyGrid: FullGridElementsType[],
    returned: boolean,
    resultEditedElements: any,
    idToUpdate: any,
    newGridArea: string
) => {
    let gridForSave: any = {}

    copyGrid.map((gridEl) => {
        console.log(gridEl, 'gridEl')
        console.log(returned, 'grid returned')
        const editedElement = resultEditedElements.find(
            (el: any) => el.id === gridEl.id
        )
        console.log(editedElement, 'editedElement')

        let [rowStart4, colStart4, rowEnd4, colEnd] = getGridAreaValues(
            gridEl.gridArea
        )
        let fsdf = gridEl.gridArea
        const fof = copyGrid
            .filter((re: any) => {
                let [rowStartre, colStartre, rowEndre, colEnd6re] =
                    getGridAreaValues(re.gridArea)

                //todo fix
                if (rowStartre === rowStart4) {
                    return true
                }
            })
            .sort((s: any, a: any) => {
                let [rowStartds, colStartres, rowEndres, colEnd6res] =
                    getGridAreaValues(s.gridArea)

                let [rowStartrea, colStartrea, rowEndrea, colEnd6rea] =
                    getGridAreaValues(a.gridArea)

                if (rowStartds > rowStartrea) {
                    return -1
                } else {
                    return 1
                }
            })

        console.log(fof, 'fof')
        fof.forEach((r: any, index: number) => {
            if (index < 1 || index > 1) {
                return
            }
            let [rowStart, colStart, rowEnd, colEnd6] = getGridAreaValues(
                r.gridArea
            )

            if (rowStart4 === rowStart) {
                fsdf = `${rowStart4}/${colStart4}/${rowEnd4}/${colStart - 1}`
                return
            }
        })

        console.log(fsdf, 'new ')

        if (editedElement) {
            if (
                gridForSave[gridEl.rowKey] &&
                gridForSave[gridEl.rowKey].length
            ) {
                gridForSave[gridEl.rowKey] = [
                    ...gridForSave[gridEl.rowKey],
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
                gridForSave[gridEl.rowKey] = [
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
            if (
                gridForSave[gridEl.rowKey] &&
                gridForSave[gridEl.rowKey].length &&
                !returned
            ) {
                console.log('gridEl1', gridForSave[gridEl.rowKey])
                gridForSave[gridEl.rowKey] = [
                    ...gridForSave[gridEl.rowKey],
                    {
                        order: gridEl.order,
                        gridArea: newGridArea,
                        type: gridEl.type,
                        id: gridEl.id,
                        url: gridEl.url,
                        backgroundColor: gridEl.backgroundColor,
                    },
                ]
                return
            } else if (
                gridForSave[gridEl.rowKey] &&
                gridForSave[gridEl.rowKey].length &&
                returned
            ) {
                console.log('gridEl2', gridForSave[gridEl.rowKey])
                gridForSave[gridEl.rowKey] = [
                    ...gridForSave[gridEl.rowKey],
                    {
                        order: gridEl.order,
                        gridArea: fsdf,
                        type: gridEl.type,
                        id: gridEl.id,
                        url: gridEl.url,
                        backgroundColor: gridEl.backgroundColor,
                    },
                ]
                return
            } else if (!gridForSave[gridEl.rowKey] && returned) {
                console.log('gridEl3', gridForSave[gridEl.rowKey])
                gridForSave[gridEl.rowKey] = [
                    {
                        order: gridEl.order,
                        gridArea: fsdf,
                        type: gridEl.type,
                        id: gridEl.id,
                        url: gridEl.url,
                        backgroundColor: gridEl.backgroundColor,
                    },
                ]
                return
            } else if (!gridForSave[gridEl.rowKey] && !returned) {
                console.log('gridEl4', gridForSave[gridEl.rowKey])
                gridForSave[gridEl.rowKey] = [
                    {
                        order: gridEl.order,
                        gridArea: newGridArea,
                        type: gridEl.type,
                        id: gridEl.id,
                        url: gridEl.url,
                        backgroundColor: gridEl.backgroundColor,
                    },
                ]
                return
            }
        }

        if (!editedElement && gridEl.id !== idToUpdate) {
            if (
                gridForSave[gridEl.rowKey] &&
                gridForSave[gridEl.rowKey].length
            ) {
                gridForSave[gridEl.rowKey] = [
                    ...gridForSave[gridEl.rowKey],
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
                gridForSave[gridEl.rowKey] = [
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
        }
    })

    return gridForSave
}
