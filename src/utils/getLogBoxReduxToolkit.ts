import { current } from '@reduxjs/toolkit'
export const getLogBoxReduxToolkit = (logName: any, log: any) => {
    console.log(logName, current(log))
}
