import { getGridAreaValues } from './getGridAreaValues'

type ResizeDirection = 'left' | 'right' | 'top' | 'bottom' | undefined

export const getResizeDirection = (
    newGridArea: string,
    oldGridArea: string
): ResizeDirection => {
    const [oldStartRow, oldStartColumn, oldEndRow, oldEndColumn] =
        getGridAreaValues(oldGridArea)
    const [newStartRow, newStartColumn, newEndRow, newEndColumn] =
        getGridAreaValues(newGridArea)

    if (newStartColumn !== oldStartColumn) return 'left'
    if (newEndColumn !== oldEndColumn) return 'right'
    if (newStartRow !== oldStartRow) return 'top'
    if (newEndRow !== oldEndRow) return 'bottom'

    return undefined
}
