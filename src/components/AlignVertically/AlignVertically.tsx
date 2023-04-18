import type { PropsWithChildren } from 'react'
import React, { useRef, useState } from 'react'
import { useDrag, useDrop } from 'react-dnd'

import { useAppDispatch } from '../../hooks'
import { removeGridEl } from '../../store/reducers'
import { ItemTypes, ItemTypeWithOrder } from '../../types/types'

import styles from './AlignVertically.module.css'

type SeparatorsType = 'top' | 'left' | 'right' | 'bottom'

type AlignVerticallyPropsType = {
    //showing: boolean
    rowId: string
    gridElId: string
    order: number
    gridAreaItem: string
    actions: string[]
    properties: string[]
    handleTop: () => void
    handleBottom: () => void
    moveItem: (fromOrder: number, toOrder: number) => void
}
export const AlignVertically = ({
    rowId,
    gridElId,
    order,
    gridAreaItem,
    actions,
    children,
    properties,
    handleTop,
    handleBottom,
    moveItem,
}: PropsWithChildren<AlignVerticallyPropsType>) => {
    const ref = useRef<HTMLDivElement>(null)
    const [showingVerticalActions, setShowingVerticalActions] = useState(false)
    const [activeAlignSelf, setActiveAlignSelf] = useState<string | undefined>(
        undefined
    )
    const dispatch = useAppDispatch()
    const show = () => setShowingVerticalActions(true)
    const hidden = () => setShowingVerticalActions(false)
    const removeGridItem = () => {
        dispatch(removeGridEl({ rowId, elId: gridElId }))
    }

    const [{ isDragging }, drag] = useDrag<
        ItemTypeWithOrder,
        {},
        {
            isDragging: boolean
        }
    >({
        type: ItemTypes.BOX1,
        //@ts-ignore
        item: { order },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    })

    const [, drop] = useDrop<
        ItemTypeWithOrder,
        {},
        {
            isOver: boolean
            canDrop: boolean
        }
    >({
        accept: ItemTypes.BOX1,
        hover: (item, monitor) => {
            if (!ref.current) {
                return
            }
            const dragOrder = item.order
            const hoverOrder = order

            if (dragOrder === hoverOrder) return
            moveItem(dragOrder, hoverOrder)
            item.order = hoverOrder
        },
    })
    drag(drop(ref))
    return (
        <div
            ref={ref}
            id={rowId}
            className={styles.alignVerticallyContainer}
            style={{
                alignItems: activeAlignSelf,
                //gridArea: gridAreaItem,
            }}
        >
            <div onMouseEnter={show} onMouseLeave={hidden}>
                <>
                    {children}
                    {showingVerticalActions && (
                        <div className={styles.alignVerticallyContent}>
                            <div className={styles.actionTop}>
                                {/*<div onClick={handleTopBack}>Back</div>*/}
                                <div onClick={handleTop}>T</div>
                            </div>
                            <div className={styles.actionBottom}>
                                {/*<div onClick={handleBottomBack}>Back</div>*/}
                                <div onClick={handleBottom}>B</div>
                            </div>
                            {actions.map((el, index) => {
                                return (
                                    <div
                                        key={index}
                                        className={styles.action}
                                        onClick={() => {
                                            setActiveAlignSelf(
                                                properties[index] ===
                                                    activeAlignSelf
                                                    ? undefined
                                                    : properties[index]
                                            )
                                        }}
                                    >
                                        {el}
                                    </div>
                                )
                            })}
                            <div
                                className={styles.remove}
                                onClick={removeGridItem}
                            >
                                X
                            </div>
                        </div>
                    )}
                </>
            </div>
        </div>
    )
}
