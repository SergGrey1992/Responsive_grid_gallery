import { Enable, HandleStyles } from 're-resizable'

export const MIN_COLUMN = 10
export const MAX_COLUMN = 60
export const GAP = 12

export const DATA_COLUMNS = [...Array(MAX_COLUMN)]

export const resizableEnable: Enable = {
    left: true,
    bottom: true,
    right: true,
    top: true,
    bottomLeft: false,
    bottomRight: false,
    topLeft: false,
    topRight: false,
}

export const resizableStyles: HandleStyles = {
    top: {},
    right: {},
    bottom: {},
    left: {},
    bottomLeft: undefined,
    bottomRight: undefined,
    topLeft: undefined,
    topRight: undefined,
}
