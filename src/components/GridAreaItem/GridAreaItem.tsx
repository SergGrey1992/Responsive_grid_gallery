import type { PropsWithChildren } from 'react'
import React, { useEffect, useState } from 'react'
//@ts-ignore
import { NumberSize } from 're-resizable'

import { GAP, MIN_COLUMN } from '../../constants'
import { useAppDispatch, useAppSelector } from '../../hooks'
import {
    changeAllData,
    setCountLoadImgInGridAC,
    testUpdateGridAreaAC,
} from '../../store/reducers'
import { ItemTypeWithOrder } from '../../types/types'
import { getGridAreaValues } from '../../utils'
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
    const [lastResizeData, setLastResizeData] = useState<null | {
        direction: string
        gridArea: string
    }>(null)

    console.log('gridArea', gridArea)
    useEffect(() => {
        setGridArea_(gridArea)
        setLastResizeData({ direction: 'right', gridArea: gridArea })
    }, [gridArea])

    const checkRight = (
        lastPositionString: string,
        currentPositionString: string,
        id: string
    ) => {
        const currentPosition = currentPositionString.split('/').map(Number)
        let resultLayouts = {}
        const copyLayouts = { ...layouts }

        const startRowPosition = currentPosition[0]
        const endRowPosition = currentPosition[2]
        const startColumnPosition = currentPosition[1]
        const endColumnPosition = currentPosition[3]

        Object.keys(copyLayouts).forEach((elKey) => {
            let elementDefferenceWithCurrentElement = 0
            const rowLayout = copyLayouts[elKey]

            let curentEl: any = null

            const test = rowLayout.map((rowElement, i) => {
                debugger
                if (lastPositionString === rowElement.gridArea) {
                    return { ...rowElement, gridArea: currentPositionString }
                }

                const elementPosition = rowElement.gridArea
                    .split('/')
                    .map(Number)

                debugger
                let startElementRowPosition = elementPosition[0]
                const endElementRowPosition = elementPosition[2]
                let startElementColumnPosition = elementPosition[1]
                let endElementColumnPosition = elementPosition[3]

                if (startElementRowPosition <= endRowPosition) {
                    if (endColumnPosition >= startElementColumnPosition) {
                        elementDefferenceWithCurrentElement =
                            endColumnPosition - startElementColumnPosition

                        if (elementDefferenceWithCurrentElement > 0) {
                            startElementColumnPosition +=
                                elementDefferenceWithCurrentElement
                            endElementColumnPosition +=
                                elementDefferenceWithCurrentElement
                        }
                    } else {
                        const elArea = curentEl.gridArea.split('/').map(Number)

                        debugger
                        elementDefferenceWithCurrentElement =
                            elArea[3] - startElementColumnPosition

                        if (elementDefferenceWithCurrentElement > 0) {
                            startElementColumnPosition +=
                                elementDefferenceWithCurrentElement
                            endElementColumnPosition +=
                                elementDefferenceWithCurrentElement
                        }
                    }
                }

                const newGridArea111111 = `${startElementRowPosition}/${startElementColumnPosition}/${endElementRowPosition}/${endElementColumnPosition}`

                curentEl = {
                    ...rowElement,
                    gridArea: newGridArea111111,
                }

                return {
                    ...rowElement,
                    gridArea: newGridArea111111,
                }
            })

            // @ts-ignore
            resultLayouts[elKey] = test
        })

        dispatch(changeAllData(resultLayouts))
    }

    const onResize = (direction: any, delta: NumberSize, id: string) => {
        if (widthOneColumnRound === undefined) return
        let increaseValue = Math.round(
            delta.width / (widthOneColumnRound + GAP)
        )
        const isNextRow = delta.height > GAP * 2
        //if (isNextRow)
        console.log('gridArea', gridArea)
        const arrValues = getGridAreaValues(gridArea)
        console.log('arrValues', arrValues)
        if (direction === 'top') {
            console.log('handleResize => top')
        } else if (direction === 'right') {
            const isMinSize =
                arrValues[3] + increaseValue - arrValues[1] <= MIN_COLUMN - 1
            console.log('isMinSize', isMinSize)
            if (isMinSize) return
            arrValues[3] = arrValues[3] + increaseValue
            setGridArea_(arrValues.join('/'))
            setLastResizeData({
                gridArea: gridArea,
                ...lastResizeData,
                direction: 'right',
            })
            //console.log('handleResize => right')
        } else if (direction === 'bottom') {
            console.log('handleResize => bottom')
            if (isNextRow) {
                arrValues[2] = arrValues[2] + 1
                setGridArea_(arrValues.join('/'))
            }
        } else if (direction === 'left') {
            const isMinSize =
                arrValues[3] + increaseValue - arrValues[1] <= MIN_COLUMN - 1
            if (isMinSize) return
            arrValues[1] = arrValues[1] - increaseValue
            //const newGridArea=arrValues.join('/')
            setGridArea_(arrValues.join('/'))
            //console.log('handleResize => left')
        }
    }

    const onResizeStop = () => {
        //console.log('onResizeStop gridArea => ', gridArea)
        dispatch(testUpdateGridAreaAC({ rowId, id, gridArea: gridArea_ }))
        dispatch(setCountLoadImgInGridAC())
        if (lastResizeData && lastResizeData.direction === 'right') {
            checkRight(lastResizeData.gridArea, gridArea_, id)
        }
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
                        <img
                            src={url}
                            className={styles.imageGrid}
                            alt={'drag_img'}
                            onLoad={() => {
                                dispatch(setCountLoadImgInGridAC())
                            }}
                        />
                    )}
                </AlignVertically>
            </WrapperResizable>
        </div>
    )
}
