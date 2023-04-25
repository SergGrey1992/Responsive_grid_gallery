import React, { useEffect, useState } from 'react'
//@ts-ignore
import { Direction } from 're-resizable'
import { v1 } from 'uuid'

import { GAP } from '../../constants'
import { useAppDispatch, useAppSelector } from '../../hooks'
import {
    addFakeGridElAC,
    addGridRowAC,
    moveItemAC,
    setCountLoadImgInGridAC,
    updateGridAreaIncRowAC,
    updateIncreaseValueAC,
    updateItemInGridRowAC,
} from '../../store/reducers'
import { RowsType } from '../../store/types'
import { ItemTypeWithOrder } from '../../types/types'
import { GridAreaItem } from '../GridAreaItem/GridAreaItem'

type GridCurrentRowPropsType = {
    gridRow: ItemTypeWithOrder[]
    rowId: string
}

export const GridCurrentRow = ({ gridRow, rowId }: GridCurrentRowPropsType) => {
    const rows = useAppSelector((state) => state.grid.rows)
    const widthOneColumnRound = useAppSelector(
        (state) => state.settings.widthOneColumnRound
    )
    const [tempGridData, setTempGridData] =
        useState<ItemTypeWithOrder[]>(gridRow)
    useEffect(() => {
        setTempGridData(gridRow)
    }, [gridRow])
    const dispatch = useAppDispatch()

    const handleResize = (direction: Direction, delta: any, id: string) => {
        if (widthOneColumnRound === undefined) return
        if (direction === 'top') {
            //console.log('handleResize => top')
        } else if (direction === 'right') {
            //console.log('handleResize => right')
        } else if (direction === 'bottom') {
            //console.log('handleResize => bottom')
        } else if (direction === 'left') {
            //console.log('handleResize => left')
        }

        const increaseValue = Math.round(
            delta.width / (widthOneColumnRound + GAP)
        )
        dispatch(updateIncreaseValueAC(increaseValue))
        //todo рабочее только для одной строки
        // const currentEl = gridRow.find((el) => el.id === id)
        // if (currentEl) {
        //     const [, columnStart, , columnEnd] = currentEl.gridArea.split('/')
        //     const columnsOccupied = parseInt(columnEnd) - parseInt(columnStart)
        //     if (columnsOccupied + increaseValue < MIN_COLUMN) {
        //         return
        //     }
        // }
        // const clonedGridData: ItemTypeWithOrder[] = JSON.parse(
        //     JSON.stringify(gridRow)
        // )
        // const updatedGridData = updateGridArea(
        //     clonedGridData,
        //     id,
        //     increaseValue
        // )
        // if (updatedGridData) {
        //     setTempGridData(updatedGridData)
        // }
    }

    const handleResizeStop = (id: string) => {
        //const [, columnStart, , columnEnd] = currentEl.gridArea.split('/')
        //const columnsOccupied = parseInt(columnEnd) - parseInt(columnStart)
        //console.log('columnsOccupied', columnsOccupied)
        dispatch(updateItemInGridRowAC({ rowId, newFullRow: tempGridData }))
        dispatch(setCountLoadImgInGridAC())
        dispatch(updateIncreaseValueAC(0))
    }
    const handleTop = () => {
        console.log('handleTop')
    }
    const handleBottom = (rowId: string, elId: string) => {
        //gridRow конкретная row
        //создание новой row
        const rowId__ = v1()
        const newRow = {
            id: rowId__,
            order: rows.length + 1,
        } as RowsType
        //определить есть ли еще row ниже
        const currentRow = rows.find((row) => row.id === rowId)
        if (currentRow) {
            const isNextRow = rows.find(
                (row) => row.order === currentRow.order + 1
            )
            if (isNextRow) {
                //кронировать все что ниже
                console.log('кронировать')
            } else {
                //просто добавить пустую row
                console.log('пустую')
                //dispatch(addGridRowAC(newRow))
                const currentRowElement = gridRow.find((el) => el.id === elId)
                //элемент растянутый или нет
                if (currentRowElement) {
                    console.log(
                        'currentRowElement.order',
                        currentRowElement.order
                    )
                    const q = currentRowElement.gridArea
                        .split('/')
                        .map((el) => +el)
                    q[2] = q[2] + 2
                    const newGridArea = q.join('/')
                    dispatch(addGridRowAC(newRow))
                    dispatch(
                        addFakeGridElAC({
                            rowId: rowId__,
                            position: currentRowElement.order,
                        })
                    )
                    dispatch(
                        updateGridAreaIncRowAC({ rowId, elId, newGridArea })
                    )
                    //console.log('newGridArea', newGridArea)
                }
                setTimeout(() => {
                    dispatch(setCountLoadImgInGridAC())
                }, 300)
            }
        }
        //dispatch(addGridRowAC(newRow))
        //const data=gridRow.find((row)=> row.)
        //const parentRow = rows.find((row) => row.id === rowId)
        //dispatch(updateOrderInRowWithIncrementAC({ rowId, gridElId, order }))
        console.log('handleBottom')
    }
    const moveItem = (fromOrder: number, toOrder: number) => {
        dispatch(moveItemAC({ rowId, fromOrder, toOrder }))
    }
    return (
        <>
            {tempGridData.map((item, index) => {
                if (item.type === 'fake') {
                    return (
                        <div
                            key={`GridDropItem.${item.id}.${index}`}
                            style={{
                                width: '100%',
                                height: '100%',
                                gridArea: item.gridArea,
                                backgroundColor: item.backgroundColor,
                                opacity: 0,
                                visibility: 'hidden',
                            }}
                        />
                    )
                }
                return (
                    <GridAreaItem
                        key={`GridDropItem.${item.id}.${index}`}
                        {...item}
                        rowId={rowId}
                        //handleResize={handleResize}
                        //handleResizeStop={handleResizeStop}
                        moveItem={moveItem}
                    />
                )
            })}
        </>
    )
}
