import React from 'react'

import { InitialStateType } from '../../store/reducers/flexLayoutBeta/flexLayoutBeta'

import { CurrentFlexRow } from './CurrentFlexRow'
import { RowWithoutType } from './RowWithoutType'
import { SliderFlexRow } from './SliderFlexRow'

interface RootLayoutFlexPropsType {
    layout: InitialStateType[]
}

export const RootLayoutFlex = ({ layout }: RootLayoutFlexPropsType) => {
    return (
        <>
            {layout.map((row) => {
                return (
                    <React.Fragment key={`Row.${row.id}`}>
                        {row.type === '' && <RowWithoutType rowId={row.id} />}
                        {row.type === 'row' && <CurrentFlexRow {...row} />}
                        {row.type === 'slider' && <SliderFlexRow {...row} />}
                    </React.Fragment>
                )
            })}
        </>
    )
}
