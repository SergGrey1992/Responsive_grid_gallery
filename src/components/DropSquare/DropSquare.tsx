import React, { useEffect, useRef } from 'react'

import { useAppDispatch, useAppSelector } from '../../hooks'
import {
    setMeasureRowsHeightAC,
    setWidthDropSquareAC,
    setWidthOneColumnAC,
    setWidthOneColumnRoundAC,
} from '../../store/reducers'
import { EmptyLayoutGrid } from '../EmptyLayoutGrid/EmptyLayoutGrid'
import { GridRow } from '../GridRow/GridRow'

export const DropSquare = () => {
    const rows = useAppSelector((state) => state.grid.rows)
    const countLoadImgInGrid = useAppSelector(
        (state) => state.settings.countLoadImgInGrid
    )
    const dispatch = useAppDispatch()
    const ref = useRef<HTMLDivElement | null>(null)
    useEffect(() => {
        if (ref.current) {
            dispatch(setWidthDropSquareAC(ref.current?.offsetWidth))
            dispatch(
                setWidthOneColumnAC((ref.current.offsetWidth - 12 * 59) / 59)
            ) //(widthDropSquare - 12 * 59) / 59
            dispatch(
                setWidthOneColumnRoundAC(
                    +((ref.current.offsetWidth - 12 * 59) / 59).toFixed(2)
                )
            ) //+((widthDropSquare - 12 * 59) / 59).toFixed(2)
        }
    }, [rows.length])
    useEffect(() => {
        if (countLoadImgInGrid) {
            const grid = document.getElementById('GridRow')
            if (grid) {
                const rows = grid.children
                const myArray = Array.from(rows)
                const myUniqueArray = myArray.filter(
                    (elem, index, self) =>
                        index === self.findIndex((t) => t.id === elem.id)
                )
                const arr = myUniqueArray.map(
                    (row) => row.getBoundingClientRect().height
                )
                const computedStyle = getComputedStyle(grid)
                const gridTemplateRows = computedStyle.gridTemplateRows
                const rowHeights = gridTemplateRows
                    .split(' ')
                    .map((h) => +h.replace('px', ''))
                console.log('rowHeights', rowHeights)
                dispatch(setMeasureRowsHeightAC(rowHeights))
            }
        }
    }, [rows.length, countLoadImgInGrid])

    if (!rows.length) {
        return <EmptyLayoutGrid />
    }
    return (
        <div ref={ref} className={'dropSquare'}>
            <GridRow countRows={rows.length} />
        </div>
    )
}
