import React, { useCallback, useEffect, useRef, useState } from 'react'
import GridLayout, { Layout, WidthProvider } from 'react-grid-layout'

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

const COLS = 60
const rowHeight = 150

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

const Grid = WidthProvider(GridLayout)

export const MyFirstGrid = () => {
    // layout is an array of objects, see the demo for more complete usage

    const dispatch = useAppDispatch()
    const layout = useAppSelector((state) => state.grid.reactLayout)
    const [maxRow, setMaxRow] = useState(0)
    const [selectedElements, setSelectedElements] = useState<string[]>([])
    const [resetLineGrid, setResetLineGrid] = useState(0)
    useEffect(() => {
        if (layout.length > 0) {
            setMaxRow(Math.max(...[...layout].map((el) => el.h)))
        }
    }, [layout.length, resetLineGrid])

    //console.log('maxRow', maxRow)
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
        <div style={{ position: 'relative' }}>
            {[...Array(COLS)].map((_, index) => {
                return (
                    <span
                        key={`Index. ${index}`}
                        style={{
                            position: 'absolute',
                            zIndex: 10,
                            left: index * (window.innerWidth / COLS),
                            width: 1,
                            top: 0,
                            bottom: 0,
                            backgroundColor: 'red',
                            whiteSpace: 'nowrap',
                            color: 'black',
                        }}
                    >
                        {index + 1}
                    </span>
                )
            })}
            {[...Array(maxRow)].map((_, index) => {
                return (
                    <span
                        key={`Row.${index}`}
                        style={{
                            position: 'absolute',
                            top: index * rowHeight,
                            backgroundColor: 'red',
                            left: 0,
                            right: 0,
                            height: 1,
                            zIndex: 10,
                            whiteSpace: 'nowrap',
                            color: 'black',
                        }}
                    >
                        {index + 1}
                    </span>
                )
            })}
            <MediaLibrary targetRef={ref} selectedElements={selectedElements} />
            <Grid
                style={{ backgroundColor: 'lightgray', minHeight: '100px' }}
                className="layout"
                layout={layout}
                cols={COLS}
                margin={[0, 0]}
                isDroppable={true}
                compactType={null}
                onLayoutChange={(layout) => {
                    console.log(layout, 'layout')
                    dispatch(changeLayout(layout))
                    setResetLineGrid((prev) => prev + 1)
                }}
                isResizable={true}
                //onResize={handleResize}
                autoSize={true}
                onDrop={(layout: Layout[], item: Layout, e: any) => {
                    const data = JSON.parse(
                        e.dataTransfer.getData('text/plain')
                    )

                    // console.log(data, 'data')
                    const img = new Image()
                    img.src = data.url
                    img.onload = () => {
                        //console.log('LOAD', img)
                        //console.log('LOAD', img.height)
                        const realWidth = img.width
                        const realHeight = img.height
                        const widthCol = window.innerWidth / COLS
                        const heightResult = (realHeight / realWidth) * widthCol
                        //console.log('heightResult', heightResult)
                        const aaa = euclideanAlgorithm(realWidth, realHeight)
                        //console.log('aaa', aaa)
                        let res = {
                            ...item,
                            isResizable: true,
                            i: data.id,
                            content: data.url,
                            w: 1,
                            h: 1,
                        }
                        //debugger
                        setSelectedElements((prev) => [...prev, data.id])
                        dispatch(addLayout(res))
                    }
                }}
                rowHeight={rowHeight}
            >
                {layout.map((l) => {
                    let aspectRatio

                    return (
                        <div key={l.i}>
                            <img
                                onLoad={(m) => {
                                    //console.log(m, 'mets')
                                    // @ts-ignore
                                    // eslint-disable-next-line prettier/prettier
                                let { naturalWidth, naturalHeight,} = m.target

                                    let gcd = euclideanAlgorithm(
                                        naturalHeight,
                                        naturalWidth
                                    )
                                    const a = naturalHeight / gcd
                                    const b = naturalWidth / gcd
                                    //console.log(b, a)
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
            </Grid>
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
