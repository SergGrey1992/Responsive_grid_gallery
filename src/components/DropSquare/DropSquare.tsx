import React, { useCallback, useEffect, useRef } from 'react'
import GridLayout, { Layout } from 'react-grid-layout'

import { useAppDispatch, useAppSelector } from '../../hooks'
import {
    addLayout,
    changeLayout,
    setMeasureRowsHeightAC,
    setWidthDropSquareAC,
    setWidthOneColumnAC,
    setWidthOneColumnRoundAC,
} from '../../store/reducers'
import { EmptyLayoutGrid } from '../EmptyLayoutGrid/EmptyLayoutGrid'
import { GridRow } from '../GridRow/GridRow'
import { MediaLibrary } from '../MediaLibrary/MediaLibrary'

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
                //console.log('rowHeights', rowHeights)
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

export const MyFirstGrid = () => {
    // layout is an array of objects, see the demo for more complete usage

    const dispatch = useAppDispatch()
    const layout = useAppSelector((state) => state.grid.reactLayout)

    console.log(layout, 'reactLayout')

    const ref = useRef()

    const handleResize = useCallback(
        (l: any, oldLayoutItem: any, layoutItem: any, placeholder: any) => {
            const heightDiff = layoutItem.h - oldLayoutItem.h
            const widthDiff = layoutItem.w - oldLayoutItem.w
            const changeCoef = oldLayoutItem.w / oldLayoutItem.h
            if (Math.abs(heightDiff) < Math.abs(widthDiff)) {
                layoutItem.h = layoutItem.w / changeCoef
                placeholder.h = layoutItem.w / changeCoef
            } else {
                layoutItem.w = layoutItem.h * changeCoef
                placeholder.w = layoutItem.h * changeCoef
            }
        },
        []
    )

    return (
        <div>
            <MediaLibrary targetRef={ref} />
            <GridLayout
                style={{ backgroundColor: 'lightgray' }}
                className="layout"
                layout={layout}
                cols={12}
                isDroppable={true}
                compactType={null}
                onLayoutChange={(layout) => {
                    console.log(layout, 'layout')
                    dispatch(changeLayout(layout))
                }}
                isResizable={true}
                onResize={handleResize}
                autoSize={true}
                onDrop={(layout: Layout[], item: Layout, e: any) => {
                    console.log(e, 'e')
                    const data = JSON.parse(
                        e.dataTransfer.getData('text/plain')
                    )

                    console.log(data, 'data')

                    let res = {
                        ...item,
                        isResizable: true,
                        i: data.id,
                        content: data.url,
                        w: 1.6,
                        h: 3,
                    }
                    debugger

                    dispatch(addLayout(res))
                }}
                rowHeight={30}
                width={1200}
            >
                {layout.map((l) => {
                    let aspectRatio

                    return (
                        <div key={l.i}>
                            <img
                                onLoad={(m) => {
                                    console.log(m, 'mets')
                                    // @ts-ignore
                                    // eslint-disable-next-line prettier/prettier
                                let { naturalWidth, naturalHeight,} = m.target

                                    let gcd = euclideanAlgorithm(
                                        naturalHeight,
                                        naturalWidth
                                    )
                                    const a = naturalHeight / gcd
                                    const b = naturalWidth / gcd
                                    console.log(b, a)
                                    aspectRatio = `${b}/${a}`
                                }}
                                style={{
                                    objectFit: 'contain',
                                    width: '100%',
                                    height: '100%',
                                    display: 'inline-block',
                                }}
                                src={l.content}
                                alt=""
                            />
                        </div>
                    )
                })}
            </GridLayout>
        </div>
    )
}

function euclideanAlgorithm(a: any, b: any) {
    // Применяем алгоритм Евклида для нахождения НОД
    while (b !== 0) {
        let remainder = a % b
        a = b
        b = remainder
    }

    // Возвращаем НОД
    return a
}
