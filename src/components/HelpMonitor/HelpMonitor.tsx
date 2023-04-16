import React, { useEffect, useState } from 'react'

import { useAppSelector } from '../../hooks'

import styles from './HelpMonitor.module.css'
const renderLog = (name: string, item: any) => (
    <div>
        {name}:{JSON.stringify(item, null, 2)}
    </div>
)
export const HelpMonitor = () => {
    const showingHelperMonitor = useAppSelector(
        (state) => state.settings.showingHelperMonitor
    )

    const measureRowsHeight = useAppSelector(
        (state) => state.settings.measureRowsHeight
    )
    const activeIdRow = useAppSelector((state) => state.settings.activeIdRow)
    const activeIndexRow = useAppSelector(
        (state) => state.settings.activeIndexRow
    )

    const [offset, setOffset] = useState(0)

    useEffect(() => {
        const onScroll = () => setOffset(window.scrollY)
        // clean up code
        window.removeEventListener('scroll', onScroll)
        window.addEventListener('scroll', onScroll, { passive: true })
        return () => window.removeEventListener('scroll', onScroll)
    }, [])
    if (!showingHelperMonitor) {
        return null
    }
    return (
        <div className={styles.helpMonitor}>
            {renderLog('measureRowsHeight', measureRowsHeight)}
            {renderLog(
                'sum',
                measureRowsHeight.reduce((partialSum, a) => partialSum + a, 0)
            )}
            {renderLog('activeIdRow', activeIdRow)}
            {renderLog('activeIndexRow', activeIndexRow)}
            {renderLog('scrollY', offset)}
        </div>
    )
}
