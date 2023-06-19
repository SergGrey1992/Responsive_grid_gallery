import React, { useEffect, useState } from 'react'

import { useAppDispatch } from '../../hooks'
import { moveItemAC } from '../../store/reducers'
import { ItemTypeWithOrder } from '../../types/types'
import { GridAreaItem } from '../GridAreaItem/GridAreaItem'

type GridCurrentRowPropsType = {
    gridRow: ItemTypeWithOrder[]
    rowId: string
}

export const GridCurrentRow = ({ gridRow, rowId }: GridCurrentRowPropsType) => {
    const [tempGridData, setTempGridData] =
        useState<ItemTypeWithOrder[]>(gridRow)
    useEffect(() => {
        setTempGridData(gridRow)
    }, [gridRow])
    const dispatch = useAppDispatch()

    console.log(tempGridData, 'tempGridData')

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
                        moveItem={moveItem}
                    />
                )
            })}
        </>
    )
}
