import { useEffect, useRef } from 'react'

type ClickHandler = (...args: any[]) => void

export const useClickAndDoubleClick = (
    onClick: ClickHandler,
    onDoubleClick: ClickHandler,
    delay: number = 300
) => {
    const clickCount = useRef(0)
    const clickTimeout = useRef<NodeJS.Timeout | null>(null)

    useEffect(() => {
        return () => {
            if (clickTimeout.current) {
                clearTimeout(clickTimeout.current)
            }
        }
    }, [])

    const handleClick = (...args: any[]) => {
        clickCount.current++

        if (clickCount.current === 1) {
            clickTimeout.current = setTimeout(() => {
                if (clickCount.current === 1) {
                    onClick(...args)
                } else {
                    onDoubleClick(...args)
                }
                clickCount.current = 0
            }, delay)
        }
    }

    return handleClick
}
