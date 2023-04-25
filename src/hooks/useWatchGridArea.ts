import { useEffect, useState } from 'react'

import { ItemTypeWithOrder } from '../types/types'
import {
    getAllGridElements,
    getGridAreaValues,
    getResizeDirection,
    getTestGridEls,
} from '../utils'
import { resizerGrid } from '../utils/resizerGrid'

import { useAppDispatch } from './useAppDispatch'
import { useAppSelector } from './useAppSelector'

export const useWatchGridArea = (
    gridArea: string,
    id: string,
    rowId: string
) => {
    const [grid, setGrid] = useState('')
    const [startRow, startColumn, endRow, endColumn] =
        getGridAreaValues(gridArea)
    const dispatch = useAppDispatch()
    const layouts = useAppSelector((state) => state.grid.layouts)
    useEffect(() => {
        setGrid(gridArea)
    }, [gridArea])
    //console.log('useWatchGridArea => gridArea =>', gridArea)
    useEffect(() => {
        // const copyLayouts = { ...layouts }
        // //делаем массив IDs всех строк из грид
        // const keysFromCopyLayouts = Object.keys(copyLayouts)
        // //создали пустой массив
        // const fullGridElements: ItemTypeWithOrder[] = []
        // //заполнили массив всеми элементами которые есть в гриде
        // keysFromCopyLayouts.forEach((el) =>
        //     fullGridElements.push(...copyLayouts[el])
        // )
        const fullGridElements = getAllGridElements(layouts)
        const fullGridElements_ = getTestGridEls(layouts)
        //console.log('fullGridElements_', fullGridElements_)
        const currentGridElement_ = fullGridElements.findIndex(
            (el) => el.id === id
        )

        //нашли элемент который увеливаем
        const currentGridElement = fullGridElements.find((el) => el.id === id)
        if (currentGridElement) {
            //console.log('currentGridElement', currentGridElementIndex)
            const direction = getResizeDirection(
                gridArea,
                currentGridElement.gridArea
            )
            const d = resizerGrid(
                id,
                rowId,
                gridArea,
                currentGridElement.gridArea,
                fullGridElements
            )
            //console.log('d =>', d)
            // const [
            //     currentStartRow,
            //     currentStartColumn,
            //     currentEndRow,
            //     currentEndColumn,
            // ] = getGridAreaValues(
            //     fullGridElements[currentGridElementIndex].gridArea
            // )
            // //узнаем куда мы увеличиваем (право лево вверх вниз)
            //
            // //ВПРАВО последняя колонка в элементе меньше чем придет из параметров
            // //currentEndColumn < endColumn
            // const isRight =
            //     currentEndColumn < endColumn || currentEndColumn > endColumn
            // //console.log('isRight', isRight)
            // //ВЛЕВО начальная колонка в элементе больше чем придет из параметров
            // //currentStartColumn > startColumn
            // const isLeft =
            //     currentStartColumn > startColumn ||
            //     currentStartColumn < startColumn
            // //console.log('isLeft', isLeft)
            // //ВВЕРХ начальная строка больше чем придет из параметров
            // //currentStartRow > startRow
            // const isTop =
            //     currentStartRow > startRow || currentStartRow < startRow
            // //console.log('isTop', isTop)
            // //ВНИЗ начальная строка меньше чем придет из параметров
            // //currentEndRow < endRow
            // const isBottom = currentEndRow < endRow || currentEndRow > endRow
            // //console.log('isBottom', isBottom)
            //
            // if (isRight) {
            //     // const newGrid = isRightHandler(
            //     //     dispatch,
            //     //     fullGridElements,
            //     //     currentGridElementIndex,
            //     //     gridArea,
            //     //     id,
            //     //     rowId
            //     // )
            //     // setGrid(newGrid)
            // }
        }
    }, [gridArea])
    return grid
}

const isRightHandler = (
    dispatch: any,
    fullGridElements: ItemTypeWithOrder[],
    currentGridElementIndex: number,
    gridArea: string,
    id: string,
    rowId: string
) => {
    let newFullGridArea_ = ''
    const [startRow, startColumn, endRow, endColumn] =
        getGridAreaValues(gridArea)
    console.log('gridArea', gridArea)
    const neededGridElements = fullGridElements.filter((grid) => {
        const [, , gridEndRow] = getGridAreaValues(grid.gridArea)
        return endRow === gridEndRow
    })
    const indexItem = neededGridElements.findIndex((grid) => grid.id === id)
    if (indexItem > -1) {
        //console.log('endColumn', endColumn)
        let prevEndColumnEl = 0
        //console.log('prevEndColumnEl', prevEndColumnEl)
        for (let i = indexItem + 1; i < neededGridElements.length; i++) {
            //console.log('123', neededGridElements[i])
            const [startRowEl, startColumnEl, endRowEl, endColumnEl] =
                getGridAreaValues(neededGridElements[i].gridArea)
            const difference = endColumn - startColumnEl
            //console.log('startColumnEl', startColumnEl)
            //console.log('endColumnEl', endColumnEl)
            if (difference > 0) {
                const newGridAreaStart = startColumnEl + difference
                const newGridAreaEnd = endColumnEl + difference
                newFullGridArea_ = `${startRowEl}/${newGridAreaStart}/${endRowEl}/${newGridAreaEnd}`
                //newFullGridArea_ = newFullGridArea
                //console.log('newFullGridArea', newFullGridArea)
                //prevEndColumnEl = newGridAreaEnd
                // dispatch(
                //     testSetNewGridAreaAC({
                //         rowId,
                //         id: neededGridElements[i].id,
                //         newGridArea: newFullGridArea,
                //     })
                // )
            } else {
                break
            }
        }
    }
    return newFullGridArea_
}
