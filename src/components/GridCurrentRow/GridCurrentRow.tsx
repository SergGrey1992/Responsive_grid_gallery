import React, { useEffect, useState } from 'react'
import { Resizable } from 're-resizable'
import { v1 } from 'uuid'

import { useAppDispatch, useAppSelector } from '../../hooks'
import {
    addFakeGridElAC,
    addGridRowAC,
    moveItemAC,
    setCountLoadImgInGridAC,
    updateGridAreaIncRowAC,
    updateItemInGridRowAC,
} from '../../store/reducers'
import { RowsType } from '../../store/types'
import { ItemTypeWithOrder } from '../../types/types'
import { updateGridArea } from '../../utils'
import { AlignVertically } from '../AlignVertically/AlignVertically'

type GridCurrentRowPropsType = {
    gridRow: ItemTypeWithOrder[]
    rowId: string
}

export const GridCurrentRow = ({ gridRow, rowId }: GridCurrentRowPropsType) => {
    const rows = useAppSelector((state) => state.grid.rows)
    const [tempGridData, setTempGridData] =
        useState<ItemTypeWithOrder[]>(gridRow)
    useEffect(() => {
        console.log('call useEffect')
        setTempGridData(gridRow)
    }, [gridRow])
    const dispatch = useAppDispatch()

    const handleResize = (delta: any, id: string) => {
        const increaseValue = Math.round(delta.width / 12)
        //console.log('increaseValue', increaseValue)
        const clonedGridData = JSON.parse(JSON.stringify(gridRow))
        const updatedGridData = updateGridArea(
            clonedGridData,
            id,
            increaseValue
        )
        if (updatedGridData) {
            setTempGridData(updatedGridData)
        }
    }

    const handleResizeStop = () => {
        dispatch(updateItemInGridRowAC({ rowId, newFullRow: tempGridData }))
        dispatch(setCountLoadImgInGridAC())
        // const increaseValue =
        //     parseInt(
        //         tempGridData.find((obj) => obj.id === 3).gridArea.split('/')[3]
        //     ) -
        //     parseInt(gridRow.find((obj) => obj.id === 3).gridArea.split('/')[3])
        //dispatch(increaseGridArea({ id: 3, value: increaseValue }))
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
                    console.log('newGridArea', newGridArea)
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
        console.log('fromOrder =>', fromOrder)
        console.log('toOrder =>', toOrder)
        dispatch(moveItemAC({ rowId, fromOrder, toOrder }))
    }
    //const sortedList = tempGridData.slice().sort((a, b) => a.order - b.order)
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
                    <AlignVertically
                        key={`GridDropItem.${item.id}.${index}`}
                        rowId={rowId}
                        gridElId={item.id}
                        order={item.order}
                        gridAreaItem={item.gridArea}
                        actions={['top', 'center', 'bottom']}
                        properties={['start', 'center', 'end']}
                        handleTop={() => handleTop()}
                        handleBottom={() => handleBottom(rowId, item.id)}
                        moveItem={moveItem}
                    >
                        <Resizable
                            className={'gridItem'}
                            size={{ width: '100%', height: '100%' }}
                            style={{
                                backgroundColor: item.backgroundColor,
                                position: 'relative',
                                width: '100%',
                                height: '100%',
                            }}
                            onResize={(event, direction, elementRef, delta) =>
                                handleResize(delta, item.id)
                            }
                            onResizeStop={handleResizeStop}
                        >
                            {item.url && (
                                <img
                                    src={item.url}
                                    style={{
                                        objectFit: 'contain',
                                        width: '100%',
                                        height: '100%',
                                        opacity: 0.2,
                                    }}
                                    alt={'drag_img'}
                                    onLoad={() => {
                                        dispatch(setCountLoadImgInGridAC())
                                    }}
                                />
                            )}
                        </Resizable>
                    </AlignVertically>
                )
            })}
        </>
    )
}
