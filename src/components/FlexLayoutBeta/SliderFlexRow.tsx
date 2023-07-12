import React from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import { WheelGesturesPlugin } from 'embla-carousel-wheel-gestures'

import { useAppDispatch } from '../../hooks'
import {
    addUrlItemInSliderRow,
    ElementType,
    InitialStateType,
    removeUrlItemInSliderRow,
} from '../../store/reducers/flexLayoutBeta/flexLayoutBeta'

import { ImgListType } from './FlexLayoutBeta'

import styles from './styles.module.css'

interface SliderFlexRowPropsType extends InitialStateType {}

export const SliderFlexRow = ({ id, rowLayout }: SliderFlexRowPropsType) => {
    const dispatch = useAppDispatch()
    const handlerDrag = (e: React.DragEvent<HTMLDivElement>) => {
        const data = e.dataTransfer.getData('text_file')
        const parseData = JSON.parse(data) as ImgListType
        console.log('dataType', parseData.type)
        dispatch(
            addUrlItemInSliderRow({
                rowId: id,
                url: parseData.url,
                type: parseData.type.includes('video') ? 'video' : 'image',
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
            <Slider slides={rowLayout} rowId={id} />
        </div>
    )
}

type SliderPropsType = {
    slides: ElementType[]
    rowId: string
}

const Slider = ({ slides, rowId }: SliderPropsType) => {
    const dispatch = useAppDispatch()
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
    if (slides.length === 0) {
        return (
            <div className={styles.emptySlider}>
                <p>Select a file from your computer and drag it to this area</p>
            </div>
        )
    }

    return (
        <div style={{ display: 'flex', gap: 16 }}>
            <div className={styles.embla}>
                <div ref={emblaRef} className={styles.emblaViewport}>
                    <div className={styles.emblaContainer}>
                        {slides.map((slide, index) => {
                            return (
                                <div
                                    key={index}
                                    className={styles.emblaSlide}
                                    onClick={(e) => {
                                        e.preventDefault()
                                        dispatch(
                                            removeUrlItemInSliderRow({
                                                rowId,
                                                itemId: slide.id,
                                            })
                                        )
                                        console.log('onClick')
                                    }}
                                >
                                    <div className={styles.emblaSlideInner}>
                                        {slide.file &&
                                        slide.file.type === 'image' ? (
                                            <img
                                                width={'auto'}
                                                height={'auto'}
                                                style={{
                                                    objectFit: 'contain',
                                                    maxHeight: 198,
                                                }} //toDo maxHeight сделать адаптивным
                                                src={slide.file.originalUrl}
                                                alt=""
                                            />
                                        ) : (
                                            <video
                                                src={slide.file?.originalUrl}
                                                width={'auto'}
                                                height={'auto'}
                                                style={{
                                                    objectFit: 'contain',
                                                    maxHeight: 198,
                                                }}
                                                muted
                                                autoPlay
                                                playsInline
                                                controls
                                            />
                                        )}
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
