import type { PropsWithChildren } from 'react'
import React from 'react'

import { useAppSelector } from '../../hooks'
import { DraggableSource } from '../GridRow/GridRow'

import styles from './MediaLibrary.module.css'

interface MediaLibraryPropsType {
    targetRef: any
}

export const MediaLibrary = ({
    targetRef,
}: PropsWithChildren<MediaLibraryPropsType>) => {
    const imageData = useAppSelector((state) => state.grid.imageData)

    return (
        <div className={styles.dragItemsContainer}>
            {imageData.map((el, index) => {
                return (
                    <DraggableSource key={index} targetRef={targetRef}>
                        <div
                            className="droppable-element"
                            draggable={true}
                            id={el.id}
                            content={el.url}
                            onDragStart={(e) =>
                                e.dataTransfer.setData(
                                    'text/plain',
                                    JSON.stringify({
                                        url: el.url,
                                        id: el.id,
                                    })
                                )
                            }
                        >
                            <img src={el.url} alt={'drag_img'} />
                        </div>
                        {/*<DragItem key={`DragItem.${index}.${el.id}`} {...el} />*/}
                    </DraggableSource>
                )
            })}
        </div>
    )
}
