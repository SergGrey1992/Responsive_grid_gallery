import React from 'react'

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
    const increaseValue = useAppSelector(
        (state) => state.grid.tempSettings.increaseValue
    )
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
            {renderLog('increaseValue', increaseValue)}
        </div>
    )
}
