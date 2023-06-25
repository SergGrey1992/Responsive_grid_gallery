import React, { useRef, useState } from 'react'
import { useDrop } from 'react-dnd'
import Draggable from 'react-draggable'

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

const elementIsInChain = (elementToTraverse: any, elementToFind: any): any => {
    if (elementToTraverse === elementToFind) {
        return elementToFind
    }
    if (elementToTraverse.parentElement) {
        return elementIsInChain(elementToTraverse.parentElement, elementToFind)
    }
    return false
}

export const DraggableSource = ({
    targetRef,
    // dispatch,
    onDrag,
    onStop,
    children,
    ...rest
}: any) => {
    const [inserted, setInserted] = useState(false)
    const onDragOverwrite = (e: any, data: any) => {
        if (onDrag) onDrag(e, data)
        const target = elementIsInChain(e.target, targetRef.current)
        if (!target && inserted) {
            setInserted(false)
            const placeHolder = document.querySelector(
                '.react-grid-placeholder'
            )
            if (placeHolder)
                // placeHolder.style.transform = 'translate(-8000px, 0px)'
                return
        }
        if (target && !inserted) {
            // dispatch({
            //     type: 'addTemp',
            //     mouseEvent: { clientX: e.clientX, clientY: e.clientY },
            // })
            setInserted(true)
            return
        }
    }
    const onStopOverwrite = (e: any, data: any) => {
        if (onStop) onStop(e, data)
        if (inserted) {
            //dispatch({ type: 'finaliseTemporaryItem' })
            setInserted(false)
        } else {
            // dispatch({ type: 'clearTemp' })
        }
    }
    return (
        <div style={{ visibility: inserted ? 'hidden' : 'visible' }}>
            <Draggable
                onDrag={onDragOverwrite}
                onStop={onStopOverwrite}
                {...rest}
                position={{ x: 0, y: 0 }}
            >
                {children}
            </Draggable>
        </div>
    )
}
