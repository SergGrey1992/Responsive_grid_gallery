import { useRef } from 'react'

export const cancellablePromise = (promise: any) => {
    let isCanceled = false

    const wrappedPromise = new Promise((resolve, reject) => {
        promise.then(
            (value: any) =>
                isCanceled ? reject({ isCanceled, value }) : resolve(value),
            (error: any) => reject({ isCanceled, error })
        )
    })

    return {
        promise: wrappedPromise,
        cancel: () => (isCanceled = true),
    }
}

export const delay = (n: any) =>
    new Promise((resolve) => setTimeout(resolve, n))

const useCancellablePromises = () => {
    const pendingPromises = useRef<any>([])

    const appendPendingPromise = (promise: any) =>
        (pendingPromises.current = [...pendingPromises.current, promise])

    const removePendingPromise = (promise: any) =>
        (pendingPromises.current = pendingPromises.current.filter(
            (p: any) => p !== promise
        ))

    const clearPendingPromises = () =>
        pendingPromises.current.map((p: any) => p.cancel())

    const api = {
        appendPendingPromise,
        removePendingPromise,
        clearPendingPromises,
    }

    return api
}

export const useClickPreventionOnDoubleClick = (
    onClick: (param: any) => void,
    onDoubleClick: any
) => {
    const api = useCancellablePromises()

    const handleClick = (param: any) => {
        api.clearPendingPromises()
        const waitForClick = cancellablePromise(delay(200))
        api.appendPendingPromise(waitForClick)

        return waitForClick.promise
            .then(() => {
                api.removePendingPromise(waitForClick)
                onClick(param)
            })
            .catch((errorInfo) => {
                api.removePendingPromise(waitForClick)
                if (!errorInfo.isCanceled) {
                    throw errorInfo.error
                }
            })
    }

    const handleDoubleClick = () => {
        api.clearPendingPromises()
        onDoubleClick()
    }

    return [handleClick, handleDoubleClick]
}
