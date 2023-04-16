import React, { CSSProperties } from 'react'
import { useDrag } from 'react-dnd'

import { DropResult, ItemType, ItemTypes } from '../../types/types'

type DragItemPropsType = {} & ItemType

export const DragItem = (props: DragItemPropsType) => {
    const [{ isDragging }, drag, preview] = useDrag<
        DropResult,
        {},
        { isDragging: boolean }
    >(() => ({
        type: ItemTypes.BOX,
        item: { item: props },
        end: (item, monitor) => {
            const dropResult = monitor.getDropResult<DropResult>()
            if (item && dropResult) {
                //console.log('dropResult', dropResult)
                //alert(`You dropped ${item.name} into ${dropResult.name}!`)
            }
        },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
            handlerId: monitor.getHandlerId(),
        }),
        previewOptions: {},
    }))
    const style: CSSProperties = {
        objectFit: 'contain',
        height: 'fit-content',
    }
    const opacity = isDragging ? 0.4 : 1
    const disablePointer = isDragging ? 'none' : 'initial'

    return (
        <>
            <div
                ref={drag}
                style={{ ...style, opacity }}
                className={'dragItem'}
            >
                <img src={props.url} alt={'drag_img'} />
            </div>
        </>
    )
}
