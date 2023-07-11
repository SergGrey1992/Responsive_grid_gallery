import React from 'react'

import { useAppDispatch } from '../../hooks'
import {
    changeRowTypeFlexBeta,
    GridType,
} from '../../store/reducers/flexLayoutBeta/flexLayoutBeta'

import styles from './styles.module.css'

type RowWithoutTypePropsType = {
    rowId: string
}

export const RowWithoutType = ({ rowId }: RowWithoutTypePropsType) => {
    const dispatch = useAppDispatch()
    const changeType = (type: GridType) => {
        dispatch(changeRowTypeFlexBeta({ rowId, rowType: type }))
    }
    return (
        <div className={styles.initialChangeRowActions}>
            <button
                onClick={() => {
                    changeType('row')
                }}
            >
                Row
            </button>
            <button
                onClick={() => {
                    changeType('slider')
                }}
            >
                Slider
            </button>
        </div>
    )
}
