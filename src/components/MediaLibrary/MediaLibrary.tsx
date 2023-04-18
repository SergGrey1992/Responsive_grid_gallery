import type { PropsWithChildren } from 'react'
import React from 'react'

import { useAppSelector } from '../../hooks'
import { DragItem } from '../DragItem/DragItem'

import styles from './MediaLibrary.module.css'

interface MediaLibraryPropsType {}

export const MediaLibrary = ({}: PropsWithChildren<MediaLibraryPropsType>) => {
    const imageData = useAppSelector((state) => state.grid.imageData)

    return (
        <div className={styles.dragItemsContainer}>
            {imageData.map((el, index) => {
                return <DragItem key={`DragItem.${index}.${el.id}`} {...el} />
            })}
        </div>
    )
}
