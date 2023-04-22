import type { PropsWithChildren } from 'react'
import React from 'react'
//@ts-ignore
import { Direction, NumberSize, Resizable } from 're-resizable'

import { resizableEnable, resizableStyles } from '../../constants'

import styles from './WrapperResizable.module.css'

interface WrapperResizablePropsType {
    id: string
    onResize: (direction: Direction, delta: NumberSize, id: string) => void
    onResizeStop: () => void
}

export const WrapperResizable = ({
    id,
    children,
    onResize,
    onResizeStop,
}: PropsWithChildren<WrapperResizablePropsType>) => {
    return (
        <Resizable
            className={styles.containerResizable}
            size={{ width: '100%', height: '100%' }}
            enable={resizableEnable}
            handleComponent={{
                top: <div />,
                right: <div />,
                bottom: <div />,
                left: <div />,
                bottomLeft: undefined,
                bottomRight: undefined,
                topLeft: undefined,
                topRight: undefined,
            }}
            handleStyles={resizableStyles}
            handleClasses={{
                top: styles.handleComponentTop,
                right: styles.handleComponentRight,
                bottom: styles.handleComponentBottom,
                left: styles.handleComponentLeft,
            }}
            onResize={(event, direction, elementRef, delta) => {
                console.log('delta', delta)
                onResize(direction, delta, '')
                //handleResize(direction, delta.width, id)
            }}
            onResizeStop={onResizeStop}
        >
            {children}
        </Resizable>
    )
}
