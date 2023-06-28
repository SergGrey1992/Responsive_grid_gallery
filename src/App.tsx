import React, { useEffect, useRef } from 'react'

import { FlexLayoutBeta } from './components/FlexLayoutBeta/FlexLayoutBeta'

import './App.css'

function App() {
    const ref = useRef<HTMLIFrameElement | null>(null)
    useEffect(() => {
        if (ref.current) {
            ref.current
            console.log('ref.current', { a: ref.current })
        }
    }, [])
    return (
        <div className="App">
            {/*<HelpMonitor />*/}
            {/*<AlertComponent />*/}
            {/*<ControlsGridLayout />*/}
            <div className={'dropSquareContainer'}>
                {/*<FlexLayout />*/}
                <FlexLayoutBeta />
            </div>
            {/*<MediaLibrary />*/}
            {/*<Layer />*/}
        </div>
    )
}

export default App
