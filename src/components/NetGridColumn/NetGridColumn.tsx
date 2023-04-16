import React, { useEffect, useState } from 'react'
import { Center } from '@chakra-ui/react'

import { useAppDispatch, useAppSelector } from '../../hooks'
import { setActiveIdRowAC, setActiveIndexRowAC } from '../../store/reducers'

import styles from './NetGridColumn.module.css'

export const NetGridColumn = () => {
    const showingGridColumns = useAppSelector(
        (state) => state.settings.showingGridColumns
    )
    const measureRowsHeight = useAppSelector(
        (state) => state.settings.measureRowsHeight
    )
    const [activeIndex, setActiveIndex] = useState(-1)
    // console.log('activeIndex', activeIndex)
    return (
        <div
            id={'NetGridColumn'}
            className={`${styles.absContainerInGrid} ${styles.netGridColumn}`}
        >
            {/*{measureRowsHeight.map((row, index) => {*/}
            {/*    return (*/}
            {/*        <GridRowHeight*/}
            {/*            key={`blockHeights.${index}`}*/}
            {/*            index={index}*/}
            {/*            row={row}*/}
            {/*        />*/}
            {/*    )*/}
            {/*})}*/}
            {[...Array(60)].map((el, index) => {
                return (
                    <div
                        key={`index.${index}`}
                        className={styles.gridColumn}
                        style={{
                            opacity: showingGridColumns ? 1 : 0,
                            // pointerEvents: showingGridColumns
                            //     ? 'none'
                            //     : 'initial',
                            backgroundColor:
                                activeIndex === index
                                    ? 'red'
                                    : 'rgba(194, 199, 222, 0.4)',
                        }}
                        onDragOver={() => {
                            //console.log('onDragOver', index + 1)
                            setActiveIndex(index)
                        }}
                        onDragLeave={() => {
                            setActiveIndex(-1)
                        }}
                    >
                        <span className={styles.gridColumnNumber}>
                            {index + 1}
                        </span>
                    </div>
                )
            })}
        </div>
    )
}

type GridRowHeightPropsType = {
    index: number
    row: number
}

const GridRowHeight = ({ index, row }: GridRowHeightPropsType) => {
    const activeIndexRow = useAppSelector(
        (state) => state.settings.activeIndexRow
    )
    const showingGridRows = useAppSelector(
        (state) => state.settings.showingGridRows
    )
    const rows = useAppSelector((state) => state.grid.rows)
    //const [ind, setInd] = useState(-1)
    const dispatch = useAppDispatch()
    useEffect(() => {
        if (activeIndexRow === -1) {
            dispatch(setActiveIndexRowAC(-1))
            dispatch(setActiveIdRowAC(''))
            return
        }
        //console.log('rowsID', rows[ind].id)
        //dispatch(setActiveIndexRowAC(activeIndexRow + 1))
        dispatch(setActiveIdRowAC(rows[activeIndexRow - 1].id))
    }, [activeIndexRow])
    //console.log('ind', ind)
    const handleMouseOver = (index: number) => {
        //console.log('handleMouseOver')
        //setInd(index)
        dispatch(setActiveIndexRowAC(index + 1))
    }
    const handleMouseLeave = () => {
        // setInd(-1)
        dispatch(setActiveIndexRowAC(-1))
    }
    return (
        <div
            //ref={ref}
            //key={`blockHeights.${index}`}
            id={`blockHeights.${index}`}
            className={styles.absGridRow}
            style={{
                opacity: showingGridRows ? 1 : 0,
                //pointerEvents: showingGridRows ? 'none' : 'initial',
                height: row,
                backgroundColor:
                    index + 1 === activeIndexRow
                        ? 'rgba(194, 199, 222, 0.5)'
                        : 'rgba(194, 199, 222, 0)',
            }}
            onDragOver={() => handleMouseOver(index)}
            onDragLeave={() => handleMouseLeave()}
            //onMouseMove={setActiveIndex}
        >
            <Center
                h={'100%'}
                color={'rgba(194, 199, 222, 1)'}
                //fontSize={activeIdRow === rows[index].id ? 30 : 20}
            >
                {`ROW ${index + 1}`}
                {`id: ${rows[index].id}`}
                {/*{`h: ${row}`}*/}
            </Center>
        </div>
    )
}
