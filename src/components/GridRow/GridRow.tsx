import React, { useRef } from 'react'
import { useDrop } from 'react-dnd'

import { useAppDispatch, useAppSelector } from '../../hooks'
import { setActiveIdRowAC, setActiveIndexRowAC } from '../../store/reducers'
import { addItemInGridRowTC } from '../../store/thunk'
import { DropResult, ItemTypes } from '../../types/types'
import { GridCurrentRow } from '../GridCurrentRow/GridCurrentRow'
import { NetGridColumn } from '../NetGridColumn/NetGridColumn'

import styles from './GridRow.module.css'

type GridRowPropsType = {
    countRows: number
}

export const GridRow = ({ countRows }: GridRowPropsType) => {
    const ref = useRef<HTMLDivElement | null>(null)
    const layoutsItems = useAppSelector((state) => state.grid.layouts)
    const activeIdRow = useAppSelector((state) => state.settings.activeIdRow)

    console.log(layoutsItems, 'layoutsItems')

    const dispatch = useAppDispatch()
    const [{ canDrop, isOver }, drop] = useDrop<
        DropResult,
        {},
        {
            isOver: boolean
            canDrop: boolean
        }
    >(
        () => ({
            accept: ItemTypes.BOX,
            drop: (item, monitor) => {
                console.log('DROP ADD ITEM => ', activeIdRow)

                dispatch(
                    addItemInGridRowTC({
                        ...item.item,
                        order: 1,
                        gridArea: `${1}/1/${1}/13`,
                        type: 'img',
                    })
                )
                //console.log('monitor => ', monitor.getClientOffset())
                //console.log('monitor => ', monitor.getDropResult())
                //setCountDrop(countDrop + 1)
                //console.log('item => ', item.item)
                //console.log('id => ', id)
                //const gridArea = 20 * (layoutsItems.length + 1)
                // addDropItem({
                //     ...item.item,
                //     order: dropStateItems.length + 1,
                //     columnPercent: 20,
                // })
                // dispatch(
                //     addItemInGridRowAC({
                //         rowId: id,
                //         item: {
                //             ...item.item,
                //             order: layoutsItems.length + 1,
                //         },
                //     })
                // )
                //@ts-ignore
                //setState((prev) => [...prev, item.name]
                dispatch(setActiveIndexRowAC(-1))
                dispatch(setActiveIdRowAC(''))
                return {}
            },
            collect: (monitor) => ({
                isOver: monitor.isOver(),
                canDrop: monitor.canDrop(),
                clientY: monitor.getClientOffset()?.y,
            }),
        }),
        [activeIdRow]
    )
    drop(ref)
    return (
        <div
            id={'GridRow'}
            ref={ref}
            className={styles.gridRow}
            style={{
                gridTemplateRows: `repeat(${countRows}, minmax(150px, auto))`,
            }}
        >
            <NetGridColumn />
            {/*<NetGridRow />*/}

            {/*{Object.keys(layoutsItems).map((rowId) => {*/}
            {/*    return layoutsItems[rowId].map((item, index) => {*/}
            {/*        return (*/}
            {/*            <GridDropItem*/}
            {/*                key={`GridDropItem.${item.id}.${index}`}*/}
            {/*                {...item}*/}
            {/*                layoutItemId={rowId}*/}
            {/*                //updateDropItem={() => {}}*/}
            {/*            />*/}
            {/*        )*/}
            {/*    })*/}
            {/*})}*/}
            {Object.keys(layoutsItems).map((rowId, index) => {
                const a = [...layoutsItems[rowId]].sort(
                    (a, b) =>
                        +a.gridArea.split('/')[1] - +b.gridArea.split('/')[1]
                )

                console.log(a, 'a')
                return (
                    <GridCurrentRow
                        key={`GridCurrentRow.${index}`}
                        gridRow={a}
                        rowId={rowId}
                    />
                )
            })}
        </div>
    )
}
