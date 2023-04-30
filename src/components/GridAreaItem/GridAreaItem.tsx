import type { PropsWithChildren } from 'react'
import React, { useEffect, useState } from 'react'
//@ts-ignore
import { NumberSize } from 're-resizable'

import { GAP, MIN_COLUMN } from '../../constants'
import { useAppDispatch, useAppSelector } from '../../hooks'
import { useWatchGridArea } from '../../hooks/useWatchGridArea'
import {
    setCountLoadImgInGridAC,
    testUpdateGridAreaAC,
} from '../../store/reducers'
import { ItemTypeWithOrder } from '../../types/types'
import { getGridAreaValues, getTestGridEls } from '../../utils'
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
    const widthOneColumnRound = useAppSelector(
        (state) => state.settings.widthOneColumnRound
    )
    const layouts = useAppSelector((state) => state.grid.layouts)
    const dispatch = useAppDispatch()
    const [gridArea_, setGridArea_] = useState(gridArea)
    // const [lastResizeData, setLastResizeData] = useState<null | {
    //     direction: string
    //     gridArea: string
    // }>(null)

    const grid = useWatchGridArea(gridArea_, id, rowId)

    useEffect(() => {
        //console.log(`order: ${order}, GRID => ${grid}`)
    }, [grid])
    //console.log('grid', grid)
    useEffect(() => {
        setGridArea_(gridArea)
        //setLastResizeData({ direction: 'right', gridArea: gridArea })
    }, [gridArea])

    // const checkRight = (
    //     lastPositionString: string,
    //     currentPositionString: string,
    //     id: string
    // ) => {
    //     const currentPosition = currentPositionString.split('/').map(Number)
    //     let resultLayouts = {}
    //     const copyLayouts = { ...layouts }
    //
    //     const startRowPosition = currentPosition[0]
    //     const endRowPosition = currentPosition[2]
    //     const startColumnPosition = currentPosition[1]
    //     const endColumnPosition = currentPosition[3]
    //
    //     Object.keys(copyLayouts).forEach((elKey) => {
    //         let elementDefferenceWithCurrentElement = 0
    //         const rowLayout = copyLayouts[elKey]
    //
    //         let curentEl: any = null
    //
    //         const test = rowLayout.map((rowElement, i) => {
    //             if (lastPositionString === rowElement.gridArea) {
    //                 return { ...rowElement, gridArea: currentPositionString }
    //             }
    //
    //             const elementPosition = rowElement.gridArea
    //                 .split('/')
    //                 .map(Number)
    //
    //             let startElementRowPosition = elementPosition[0]
    //             const endElementRowPosition = elementPosition[2]
    //             let startElementColumnPosition = elementPosition[1]
    //             let endElementColumnPosition = elementPosition[3]
    //
    //             if (startElementRowPosition <= endRowPosition) {
    //                 if (endColumnPosition >= startElementColumnPosition) {
    //                     elementDefferenceWithCurrentElement =
    //                         endColumnPosition - startElementColumnPosition
    //
    //                     if (elementDefferenceWithCurrentElement > 0) {
    //                         startElementColumnPosition +=
    //                             elementDefferenceWithCurrentElement
    //                         endElementColumnPosition +=
    //                             elementDefferenceWithCurrentElement
    //                     }
    //                 } else {
    //                     const elArea = curentEl.gridArea.split('/').map(Number)
    //                     elementDefferenceWithCurrentElement =
    //                         elArea[3] - startElementColumnPosition
    //
    //                     if (elementDefferenceWithCurrentElement > 0) {
    //                         startElementColumnPosition +=
    //                             elementDefferenceWithCurrentElement
    //                         endElementColumnPosition +=
    //                             elementDefferenceWithCurrentElement
    //                     }
    //                 }
    //             }
    //
    //             const newGridArea111111 = `${startElementRowPosition}/${startElementColumnPosition}/${endElementRowPosition}/${endElementColumnPosition}`
    //
    //             curentEl = {
    //                 ...rowElement,
    //                 gridArea: newGridArea111111,
    //             }
    //
    //             return {
    //                 ...rowElement,
    //                 gridArea: newGridArea111111,
    //             }
    //         })
    //
    //         // @ts-ignore
    //         resultLayouts[elKey] = test
    //     })
    //
    //     dispatch(changeAllData(resultLayouts))
    // }

    const [test, setTest] = useState<{ [p: string]: ItemTypeWithOrder[] }>({})
    //console.log('test', test)
    const fullGridElements_ = getTestGridEls(layouts)
    const onResize = (direction: any, delta: NumberSize, id: string) => {
        if (widthOneColumnRound === undefined) return
        let increaseValue = Math.round(
            delta.width / (widthOneColumnRound + GAP)
        )
        const isNextRow = delta.height > GAP * 2
        const isPrevRow = delta.height > GAP * 2
        //if (isNextRow)
        console.log('isPrevRow', delta.height)
        //console.log('gridArea', gridArea)
        const arrValues = getGridAreaValues(gridArea)
        //console.log('arrValues', arrValues)
        if (direction === 'top') {
            if (isPrevRow) {
                arrValues[0] = arrValues[0] - 1
                setGridArea_(arrValues.join('/'))
            }
            //console.log('handleResize => top')
        } else if (direction === 'right') {
            const isMinSize =
                arrValues[3] + increaseValue - arrValues[1] <= MIN_COLUMN - 1
            //console.log('isMinSize', isMinSize)
            if (isMinSize) return
            arrValues[3] = arrValues[3] + increaseValue
            setGridArea_(arrValues.join('/'))
            const indexEl = layouts[rowId].findIndex((el) => el.id === id)
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
            //const res = updateLayout(layouts, rowId, id, increaseValue)
            //getGridAreasFromState(res)
            //setTest(res)
            // setLastResizeData({
            //     gridArea: gridArea,
            //     ...lastResizeData,
            //     direction: 'right',
            // })
            //console.log('handleResize => right')
        } else if (direction === 'bottom') {
            //console.log('handleResize => bottom')
            if (isNextRow) {
                arrValues[2] = arrValues[2] + 1
                setGridArea_(arrValues.join('/'))
            }
        } else if (direction === 'left') {
            const isMinSize =
                arrValues[3] + increaseValue - arrValues[1] <= MIN_COLUMN - 1
            if (isMinSize) return
            arrValues[1] = arrValues[1] - increaseValue
            setGridArea_(arrValues.join('/'))
            //console.log('handleResize => left')
        }
    }

    const onResizeStop = () => {
        //console.log('onResizeStop gridArea => ', gridArea)
        dispatch(testUpdateGridAreaAC({ rowId, id, gridArea: gridArea_ }))
        //dispatch(testSetNewFullLayoutAC(test))
        //setTest({})
        dispatch(setCountLoadImgInGridAC())

        // if (lastResizeData && lastResizeData.direction === 'right') {
        //     checkRight(lastResizeData.gridArea, gridArea_, id)
        // }
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
