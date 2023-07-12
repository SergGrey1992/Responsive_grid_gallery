import React from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import { WheelGesturesPlugin } from 'embla-carousel-wheel-gestures'

import { useAppDispatch } from '../../hooks'
import {
    addUrlItemInSliderRow,
    ElementType,
    InitialStateType,
} from '../../store/reducers/flexLayoutBeta/flexLayoutBeta'

import styles from './styles.module.css'

interface SliderFlexRowPropsType extends InitialStateType {}

export const SliderFlexRow = ({ id, rowLayout }: SliderFlexRowPropsType) => {
    const dispatch = useAppDispatch()
    const handlerDrag = (e: React.DragEvent<HTMLDivElement>) => {
        const data = e.dataTransfer.getData('text_file')
        dispatch(
            addUrlItemInSliderRow({
                rowId: id,
                url: data,
            })
        )
    }
    return (
        <div
            className={styles.sliderContainer}
            onDrop={handlerDrag}
            onDragOver={(e) => {
                e.preventDefault()
            }}
        >
            <Slider slides={rowLayout} />
        </div>
    )
}

type SliderPropsType = {
    slides: ElementType[]
}

const Slider = ({ slides }: SliderPropsType) => {
    const [emblaRef, embla] = useEmblaCarousel(
        { loop: false, dragFree: true },
        [
            WheelGesturesPlugin({
                //forceWheelAxis,
                //target,
            }),
        ]
    )
    // useEffect(() => {
    //     if (embla) {
    //         const onSelect = () => {
    //             setSelectedIndex(embla.selectedScrollSnap())
    //             setPrevBtnEnabled(embla.canScrollPrev())
    //             setNextBtnEnabled(embla.canScrollNext())
    //         }
    //
    //         setScrollSnaps(embla.scrollSnapList())
    //         embla.on('select', onSelect)
    //         onSelect()
    //     }
    // }, [embla])
    console.log('slides', slides)
    return (
        <div style={{ display: 'flex', gap: 16 }}>
            <div className={styles.embla}>
                <div ref={emblaRef} className={styles.emblaViewport}>
                    <div className={styles.emblaContainer}>
                        {slides.map((slide, index) => {
                            return (
                                <div key={index} className={styles.emblaSlide}>
                                    <div className={styles.emblaSlideInner}>
                                        <img
                                            width={'auto'}
                                            height={'auto'}
                                            style={{
                                                objectFit: 'contain',
                                                maxHeight: 198,
                                            }} //toDo maxHeight сделать адаптивным
                                            src={slide.file?.originalUrl}
                                            alt=""
                                        />
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        </div>
    )
}
