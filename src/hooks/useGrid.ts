import { useEffect, useState } from 'react'

import { GAP } from '../constants'
import { ItemTypeWithOrder } from '../types/types'

import { useAppSelector } from './useAppSelector'

export const useGrid = (gridCurrentRow: ItemTypeWithOrder[]) => {
    const widthOneColumnRound = useAppSelector(
        (state) => state.settings.widthOneColumnRound
    )
    const [increaseValue, setIncreaseValue] = useState(0)
    const [tempGridData, setTempGridData] =
        useState<ItemTypeWithOrder[]>(gridCurrentRow)
    useEffect(() => {
        setTempGridData(gridCurrentRow)
    }, [gridCurrentRow])

    const updateGridArea = (delta: number, id: string) => {
        if (widthOneColumnRound === undefined) return
        const increaseValue = Math.round(delta / (widthOneColumnRound + GAP))
        setIncreaseValue(increaseValue)
    }

    return { gridRow: tempGridData, updateGridArea }
}
