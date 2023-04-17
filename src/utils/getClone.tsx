export const getClone = <T,>(data: T): T => JSON.parse(JSON.stringify(data))
