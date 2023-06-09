import type { PropsWithChildren } from 'react'
import React, { useEffect, useRef, useState } from 'react'
import { PanelGroup } from 'react-resizable-panels'
import useEmblaCarousel from 'embla-carousel-react'
import { WheelGesturesPlugin } from 'embla-carousel-wheel-gestures'

import { useAppDispatch, useAppSelector } from '../../hooks'
import { useClickPreventionOnDoubleClick } from '../../hooks/useClickPreventionOnDoubleClick'
import {
    addItemInRowFlexBeta,
    addNewRowFlexBeta,
    InitialStateType,
} from '../../store/reducers/flexLayoutBeta/flexLayoutBeta'

import { RootLayoutFlex } from './RootLayoutFlex'

import styles from './styles.module.css'

interface FlexLayoutPropsType {}

type RenderLayoutPropsType = {
    node: any
    dispatch: any
}

function RenderLayout({ node, dispatch }: RenderLayoutPropsType) {
    // console.log('node.children', node.children)
    // if (!Array.isArray(node.children)) return undefined
    // if (Array.isArray(node.children) && node.children.length === 0) {
    //     return <div className={styles.emptyBox}>Empty</div>
    // }
    // return node.children.map((n, index, array) => {
    //     //console.log('12312', n.children.length)
    //     const removeItem = () => {
    //         dispatch(removeItemInRowFlexBeta(n))
    //     }
    //     const divideItem = () => {
    //         dispatch(divideItemInRowFlexBeta(n))
    //     }
    //     return (
    //         <React.Fragment key={`Wrapper.${index}`}>
    //             <Panel
    //                 className={styles.PanelGroup}
    //                 onResize={(size) => {
    //                     console.log('*'.repeat(10))
    //                     console.log('n', n.id)
    //                     console.log('size', Math.round(size))
    //                 }}
    //             >
    //                 <PanelGroup
    //                     direction={n.direction || 'horizontal'}
    //                     onLayout={(size) => {
    //                         //console.log('size', size)
    //                     }}
    //                 >
    //                     {Array.isArray(n.children) ? (
    //                         n.direction && RenderLayout({ node: n, dispatch })
    //                     ) : (
    //                         <div className={styles.PanelContent}>
    //                             <div className={styles.del}>
    //                                 <button onClick={removeItem}>del</button>
    //                             </div>
    //                             <div className={styles.divideBox}>
    //                                 <button onClick={divideItem}>divide</button>
    //                             </div>
    //                             {/*//@ts-ignore*/}
    //                             {n.children.url === null ? (
    //                                 <div
    //                                     className={styles.emptyImgBox}
    //                                     onDrop={(e) => {
    //                                         const data =
    //                                             e.dataTransfer.getData(
    //                                                 'text_file'
    //                                             )
    //
    //                                         console.log('data', data)
    //                                         dispatch(
    //                                             addUrlItemInRowFlexBeta({
    //                                                 id: n.id,
    //                                                 url: data,
    //                                             })
    //                                         )
    //                                     }}
    //                                     onDragOver={(e) => {
    //                                         e.preventDefault()
    //                                     }}
    //                                 >
    //                                     <div>Empty img</div>
    //                                     <div>{n.id}</div>
    //                                 </div>
    //                             ) : (
    //                                 <ImageRender
    //                                     //@ts-ignore
    //                                     url={n.children.url}
    //                                     id={n.id}
    //                                     onClick={() => {
    //                                         console.log('onClick')
    //                                     }}
    //                                     onDoubleClick={divideItem}
    //                                 />
    //                             )}
    //                         </div>
    //                     )}
    //                 </PanelGroup>
    //             </Panel>
    //             {!(array.length - 1 === index) && (
    //                 <ResizeHandle className={styles.resizeHandleRed} />
    //             )}
    //         </React.Fragment>
    //     )
    // })
}

type ImageRenderPropsType = {
    url: string
    id: string
    onClick: () => void
    onDoubleClick: () => void
}

const ImageRender = ({
    url,
    id,
    onClick,
    onDoubleClick,
}: ImageRenderPropsType) => {
    const [handleClick, handleDoubleClick] = useClickPreventionOnDoubleClick(
        onClick,
        onDoubleClick
    )
    return (
        <div onClick={handleClick} onDoubleClick={handleDoubleClick}>
            <span>{id}</span>
            <img width={'100%'} src={url} alt="" />
        </div>
    )
}

export const FlexLayoutBeta = ({}: PropsWithChildren<FlexLayoutPropsType>) => {
    const layout = useAppSelector((state) => state.flex)
    const dispatch = useAppDispatch()
    const addRow = () => {
        dispatch(addNewRowFlexBeta())
    }
    //console.log('layout', layout)
    return (
        <div className={styles.ContainerLayout}>
            <div className={styles.Container}>
                <div className={styles.BottomRow}>
                    <RootLayoutFlex layout={layout} />
                </div>
                <div>
                    <button className={styles.buttonAddRow} onClick={addRow}>
                        add Row
                    </button>
                </div>
            </div>
            <ImageData />
        </div>
    )
}

type RenderRootLayoutFlexBetaType = {
    layout: InitialStateType[]
}

const RenderRootLayoutFlexBeta = ({ layout }: RenderRootLayoutFlexBetaType) => {
    const dispatch = useAppDispatch()
    return (
        <>
            {layout.map((row, index) => {
                const addItemInRow = () => {
                    //todo
                    // if (Array.isArray(row.children) && row.children.length >= 6)
                    //     return
                    dispatch(addItemInRowFlexBeta(row.id))
                }
                //@ts-ignore
                //console.log('row', row.children.length)
                return (
                    <PanelGroup
                        key={`PanelGroup.${index}`}
                        autoSaveId={`example`}
                        direction={'horizontal'}
                        className={styles.MainRow}
                    >
                        <div className={styles.ButtonRowAddItem}>
                            {/*todo*/}
                            {/*{!(*/}
                            {/*    Array.isArray(row.children) &&*/}
                            {/*    row.children.length >= 6*/}
                            {/*) && (*/}
                            {/*    <button onClick={addItemInRow}>add item</button>*/}
                            {/*)}*/}
                        </div>

                        {/*{RenderLayout({ node: row, dispatch })}*/}
                    </PanelGroup>
                )
            })}
        </>
    )
}

export type ImgListType = {
    type: string
    url: string
}

const ImageData = () => {
    const layout = useAppSelector((state) => state.flex)
    const [urls, setUrls] = useState<string[]>([])
    useEffect(() => {
        const extractIds = (items: InitialStateType[]) => {
            return items.reduce((acc, item) => {
                const ids = item.rowLayout.map((el) => {
                    if (el.file) {
                        return el.file?.originalUrl
                    }
                    return ''
                })
                return [...acc, ...ids]
            }, [] as string[])
        }
        setUrls(extractIds(layout))
    }, [layout])
    const ref = useRef<HTMLInputElement | null>(null)
    const [fileList, setFileList] = useState<File[]>()
    const [imgList, setImgList] = useState<ImgListType[]>([])
    const onChangeFile = (event: React.ChangeEvent<HTMLInputElement>) => {
        //console.log('event', event.target.files)
        if (event.target.files) {
            //@ts-ignore
            setFileList([...event.target.files])
        }
    }
    useEffect(() => {
        if (!fileList) {
            setImgList([])
            return
        }
        console.log('fileList')
        fileList.forEach((file) => {
            console.log('file', file)
            const objectUrl = URL.createObjectURL(file)
            setImgList((prev) => [...prev, { type: file.type, url: objectUrl }])
        })

        // free memory when ever this component is unmounted
        return () => {
            //URL.revokeObjectURL(objectUrl)
            imgList.forEach((file) => {
                URL.revokeObjectURL(file.url)
            })
        }
    }, [fileList?.length])
    //console.log('imgList', imgList)
    const [isOpen, setIsOpen] = useState(true)
    const resetAllImageData = () => {
        setFileList([])
        setImgList([])
        if (ref.current) {
            ref.current.value = ''
        }
    }
    const openInput = () => {
        if (ref.current) {
            ref.current.value = ''
            ref.current.click()
        }
    }
    const [emblaRef, embla] = useEmblaCarousel(
        { loop: false, dragFree: true, watchDrag: false },
        [
            WheelGesturesPlugin({
                //forceWheelAxis,
                //target,
            }),
        ]
    )
    return (
        <div className={styles.imageData}>
            <div className={styles.imageLibOpener}>
                <button
                    onClick={() => {
                        setIsOpen(!isOpen)
                    }}
                >
                    {!isOpen ? (
                        <div>
                            <svg
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M7.41 15.41L12 10.83L16.59 15.41L18 14L12 8L6 14L7.41 15.41Z"
                                    fill="black"
                                />
                            </svg>
                        </div>
                    ) : (
                        <div>
                            <svg
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M7.41 8.58984L12 13.1698L16.59 8.58984L18 9.99984L12 15.9998L6 9.99984L7.41 8.58984Z"
                                    fill="black"
                                />
                            </svg>
                        </div>
                    )}
                </button>
            </div>
            {isOpen && (
                <>
                    <div style={{ width: '100%' }}>
                        <button onClick={openInput}>Add Media</button>
                    </div>
                    <div
                        style={{
                            width: 0,
                            height: 0,
                            opacity: 0,
                        }}
                    >
                        <input
                            ref={ref}
                            type="file"
                            multiple
                            onChange={onChangeFile}
                        />
                    </div>

                    <div className={styles.imagesPreview}>
                        {imgList.map((file, index) => {
                            if (urls.includes(file.url)) {
                                return null
                            }
                            return (
                                <div
                                    key={`img.${index}`}
                                    style={{
                                        height: 'fit-content',
                                    }}
                                >
                                    {file.type.includes('image') ? (
                                        <img
                                            style={{
                                                height: 190,
                                                objectFit: 'contain',
                                            }}
                                            src={file.url}
                                            alt=""
                                            draggable
                                            onDragStart={(ev) => {
                                                ev.stopPropagation()
                                                const data = JSON.stringify({
                                                    url: file.url,
                                                    type: file.type,
                                                })
                                                ev.dataTransfer.setData(
                                                    'text_file',
                                                    data
                                                )
                                            }}
                                        />
                                    ) : (
                                        <video
                                            draggable
                                            onDragStart={(ev) => {
                                                console.log('onDrag')
                                                //ev.preventDefault()
                                                ev.stopPropagation()
                                                const data = JSON.stringify({
                                                    url: file.url,
                                                    type: file.type,
                                                })
                                                ev.dataTransfer.setData(
                                                    'text_file',
                                                    data
                                                )
                                            }}
                                            src={file.url}
                                            controls={true}
                                            style={{
                                                height: 190,
                                                objectFit: 'contain',
                                            }}
                                            muted={true}
                                            autoPlay
                                        />
                                    )}
                                </div>
                            )
                        })}
                    </div>
                </>
            )}
        </div>
    )
}

const arr = [1]

const newArr = arr.map((el, index, array) => {
    return !(array.length - 1 === index) ? el + 10 : el
})

console.log('arr', newArr)

const E = () => {
    return (
        <div id={'h'}>
            <div id={'V'}></div>
        </div>
    )
}
