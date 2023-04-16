import React, { useState } from 'react'
import { Resizable } from 're-resizable'

import { useAppDispatch, useAppSelector } from '../../hooks'
import { setCountLoadImgInGridAC } from '../../store/reducers'
import { ItemTypeWithOrder } from '../../types/types'
import { AlignVertically } from '../AlignVertically/AlignVertically'

type GridDropItemProps = {
    layoutItemId: string
    //addDropItem: (item: ItemTypeWithOrder) => void
    //updateDropItem: (id: string, delta: number) => void
} & ItemTypeWithOrder

export const GridDropItem = (props: GridDropItemProps) => {
    const widthOneColumnRound = useAppSelector(
        (state) => state.settings.widthOneColumnRound
    )
    const dispatch = useAppDispatch()
    const [tempIncreaseValue, setTempIncreaseValue] = useState(0)
    console.log('tempIncreaseValue', tempIncreaseValue)
    const onResize = (delta: number) => {
        if (widthOneColumnRound) {
            setTempIncreaseValue(
                Math.ceil(delta / (Math.ceil(widthOneColumnRound) + 12))
            )
            dispatch(setCountLoadImgInGridAC())
        }
    }
    const handleTop = () => {
        console.log('handleTop')
    }
    const handleBottom = () => {
        //dispatch(updateOrderInRowWithIncrementAC({ rowId, gridElId, order }))
        console.log('handleBottom')
    }
    return (
        <AlignVertically
            rowId={props.layoutItemId}
            gridElId={props.id}
            order={props.order}
            gridAreaItem={props.gridArea}
            actions={['top', 'center', 'bottom']}
            properties={['start', 'center', 'end']}
            handleTop={handleTop}
            handleBottom={handleBottom}
        >
            <Resizable
                className={'gridItem'}
                size={{ width: '100%', height: '100%' }}
                style={{
                    backgroundColor: props.backgroundColor,
                    position: 'relative',
                }}
                onResize={(event, direction, elementRef, delta) =>
                    onResize(delta.width)
                }
            >
                {props.url && (
                    <img
                        src={props.url}
                        style={{
                            objectFit: 'contain',
                            width: '100%',
                            height: '100%',
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
}
