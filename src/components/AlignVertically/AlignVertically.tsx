import type { PropsWithChildren } from 'react'
import React, { useState } from 'react'

import { useAppDispatch } from '../../hooks'

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
}: PropsWithChildren<AlignVerticallyPropsType>) => {
    const [showingVerticalActions, setShowingVerticalActions] = useState(false)
    const [activeAlignSelf, setActiveAlignSelf] = useState<string | undefined>(
        undefined
    )
    const show = () => setShowingVerticalActions(true)
    const hidden = () => setShowingVerticalActions(false)
    const dispatch = useAppDispatch()

    return (
        <div
            id={rowId}
            className={styles.alignVerticallyContainer}
            style={{
                alignItems: activeAlignSelf,
                gridArea: gridAreaItem,
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
                        </div>
                    )}
                </>
            </div>
        </div>
    )
}
