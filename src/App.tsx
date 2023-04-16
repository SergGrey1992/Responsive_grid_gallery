import React from 'react'

import {
    ControlsGridLayout,
    DragItem,
    DropSquare,
    HelpMonitor,
} from './components'
import { useAppSelector } from './hooks'

import './App.css'

function App() {
    const imageData = useAppSelector((state) => state.grid.imageData)
    return (
        <div className="App">
            <HelpMonitor />
            <ControlsGridLayout />
            <div className={'dropSquareContainer'}>
                <DropSquare />
            </div>
            <div className={'dragItemsContainer'}>
                {imageData.map((el, index) => {
                    return (
                        <DragItem key={`DragItem.${index}.${el.id}`} {...el} />
                    )
                })}
            </div>
            {/*<Layer />*/}
        </div>
    )
}

export default App
