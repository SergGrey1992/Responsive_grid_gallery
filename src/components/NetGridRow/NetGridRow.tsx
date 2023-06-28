import React, { useEffect } from 'react'

// import { Center } from '@chakra-ui/react'
import { useAppDispatch, useAppSelector } from '../../hooks'
import { setActiveIdRowAC, setActiveIndexRowAC } from '../../store/reducers'

import styles from './NetGridRow.module.css'

type NetGridRowPropType = {
    //yPositionMouse: number | undefined
}

export const NetGridRow = ({}: NetGridRowPropType) => {
    const measureRowsHeight = useAppSelector(
        (state) => state.settings.measureRowsHeight
    )

    return (
        <div id={'NetGridRow'} className={styles.absContainerInGrid}>
            {measureRowsHeight.map((row, index) => {
                return (
                    <GridRowHeight
                        key={`blockHeights.${index}`}
                        index={index}
                        row={row}
                    />
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
            <div
                //h={'100%'}
                color={'rgba(194, 199, 222, 1)'}
                //fontSize={activeIdRow === rows[index].id ? 30 : 20}
            >
                {`ROW ${index + 1}`}
                {`id: ${rows[index].id}`}
                {/*{`h: ${row}`}*/}
            </div>
        </div>
    )
}
