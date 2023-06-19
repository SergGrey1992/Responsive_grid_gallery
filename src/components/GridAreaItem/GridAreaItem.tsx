import type { PropsWithChildren } from 'react'
import React, { useEffect, useRef, useState } from 'react'
import { NumberSize } from 're-resizable'

import { GAP, MIN_COLUMN } from '../../constants'
import { useAppDispatch, useAppSelector } from '../../hooks'
import {
    changeAllData,
    setCountLoadImgInGridAC,
    setNewGridArea,
} from '../../store/reducers'
import { ItemTypeWithOrder } from '../../types/types'
import { getAllGridElements, getGridAreaValues } from '../../utils'
import { updateGridAreas } from '../../utils/updateGrisAreas'
import { AlignVertically } from '../AlignVertically/AlignVertically'
import { WrapperResizable } from '../WrapperResizable/WrapperResizable'

import styles from './GridAreaItem.module.css'

interface GridAreaItemPropsType extends ItemTypeWithOrder {
    rowId: string
    moveItem: (fromOrder: number, toOrder: number) => void
}

export const GridAreaItem = (
    props: PropsWithChildren<GridAreaItemPropsType>
) => {
    const {
        id,
        gridArea,
        backgroundColor,
        order,
        type,
        url,
        rowId,
        //handleResize,
        //handleResizeStop,
        moveItem,
    } = props
    console.log(id, ' id')
    const widthOneColumnRound = useAppSelector(
        (state) => state.settings.widthOneColumnRound
    )
    const layouts = useAppSelector((state) => state.grid.layouts)
    const dispatch = useAppDispatch()
    const [gridArea_, setGridArea_] = useState(gridArea)

    console.log(gridArea, 'gridArea')
    console.log(gridArea_, 'gridArea_')

    console.log(layouts, 'layouts')

    useEffect(() => {
        setGridArea_(gridArea)
    }, [gridArea])

    const testing = (idElement: string, increaseValue: number) => {
        const fullGridElements = getAllGridElements(layouts)
        console.log(fullGridElements, 'fullGridElements')
        const updateGridAreas_ = updateGridAreas(fullGridElements, idElement, 1)
        updateGridAreas_ && dispatch(changeAllData(updateGridAreas_))
        console.log('updateGridAreas_', updateGridAreas_)
    }

    const testIncrease = useRef(0)
    const onResize = (direction: any, delta: NumberSize, id: string) => {
        if (widthOneColumnRound === undefined) return

        console.log(delta.width, 'delta.width')
        // ширина на сколько колонок увеличился элемент
        let increaseValue = Math.round(
            delta.width / (widthOneColumnRound + GAP)
        )
        console.log(increaseValue, 'increaseValue')
        console.log(testIncrease, 'testIncrease')
        const isNextRow = delta.height > GAP * 2
        const isPrevRow = delta.height > GAP * 2

        console.log('isPrevRow', delta.height)

        const arrValues = getGridAreaValues(gridArea)

        if (direction === 'top') {
            if (isPrevRow) {
                arrValues[0] = arrValues[0] - 1
                setGridArea_(arrValues.join('/'))
            }
        } else if (direction === 'right') {
            const isMinSize =
                arrValues[3] + increaseValue - arrValues[1] <= MIN_COLUMN - 1
            if (isMinSize) return
            arrValues[3] = arrValues[3] + increaseValue
            //todo Даня
            // if (indexEl > -1) {
            //     const res = increaseGridAreaAndRecalculate(
            //         fullGridElements_,
            //         increaseValue,
            //         0,
            //         indexEl
            //     )
            //     console.log('res => ', res)
            // }
            if (increaseValue > testIncrease.current) {
                console.log('ritght test work')
                testing(id, increaseValue)
                testIncrease.current = increaseValue
            }
        } else if (direction === 'bottom') {
            if (isNextRow) {
                const rows = Object.keys(layouts).length
                const array = arrValues[2]

                if (rows < array) {
                    return
                }
                arrValues[2] = arrValues[2] + 1
                setGridArea_(arrValues.join('/'))
                dispatch(
                    setNewGridArea({
                        rowId: rowId,
                        itemId: id,
                        newGridArea: arrValues.join('/'),
                    })
                )
            }
        } else if (direction === 'left') {
            const isMinSize =
                arrValues[3] + increaseValue - arrValues[1] <= MIN_COLUMN - 1
            if (isMinSize) return
            arrValues[1] = arrValues[1] - increaseValue
            setGridArea_(arrValues.join('/'))
        }
    }

    const onResizeStop = () => {
        testIncrease.current = 0

        console.log(testIncrease.current, 'testIncrease.current')
        dispatch(setCountLoadImgInGridAC())
    }

    return (
        <div
            id={'GridAreaItem'}
            className={styles.containerGridAreaItem}
            style={{
                gridArea: gridArea_,
            }}
        >
            <WrapperResizable
                id={id}
                onResize={onResize}
                onResizeStop={onResizeStop}
            >
                <AlignVertically
                    rowId={rowId}
                    gridElId={id}
                    order={order}
                    gridAreaItem={gridArea}
                    actions={['top', 'center', 'bottom']}
                    properties={['start', 'center', 'end']}
                    handleTop={() => {
                        //handleTop()
                    }}
                    handleBottom={() => {
                        //handleBottom(rowId, id)
                    }}
                    moveItem={moveItem}
                >
                    {url && (
                        <>
                            <div className={styles.idItem}>{id}</div>
                            <div className={styles.gridAreaText}>
                                {gridArea}
                            </div>
                            <img
                                src={url}
                                className={styles.imageGrid}
                                alt={'drag_img'}
                                onLoad={() => {
                                    dispatch(setCountLoadImgInGridAC())
                                }}
                            />
                        </>
                    )}
                </AlignVertically>
            </WrapperResizable>
        </div>
    )
}
