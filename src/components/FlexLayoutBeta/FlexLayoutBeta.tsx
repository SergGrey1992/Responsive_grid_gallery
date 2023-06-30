import type { PropsWithChildren } from 'react'
import React, { useEffect, useState } from 'react'
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels'

import { useAppDispatch, useAppSelector } from '../../hooks'
import {
    addItemInRowFlexBeta,
    addNewRowFlexBeta,
    addUrlItemInRowFlexBeta,
    divideItemInRowFlexBeta,
    NodeType,
    removeItemInRowFlexBeta,
} from '../../store/reducers/flexLayoutBeta/flexLayoutBeta'

import styles from './styles.module.css'

interface FlexLayoutPropsType {}

type ResizeHandlePropsType = {
    className?: string
    id?: string
    index?: number
}

export function ResizeHandle({
    className = '',
    id,
    index,
}: ResizeHandlePropsType) {
    return (
        <PanelResizeHandle
            className={[styles.ResizeHandleOuter, className].join(' ')}
            id={id}
        >
            {/*{index}*/}
            <div className={styles.ResizeHandleInner}>
                <svg className={styles.Icon} viewBox="0 0 24 24">
                    <path
                        fill="currentColor"
                        d="M8,18H11V15H2V13H22V15H13V18H16L12,22L8,18M12,2L8,6H11V9H2V11H22V9H13V6H16L12,2Z"
                    />
                </svg>
            </div>
        </PanelResizeHandle>
    )
}

const data = [
    [1, 2, 3],
    [1, 2, 3, 4],
    [1, 2],
]

//<PanelGroup autoSaveId="example" direction={"vertical"}>

// type WrapperPropsType = {
//     children: NODETYPE
// }
//
// const Wrapper = ({ children }: WrapperPropsType) => {
//     return (
//         <React.Fragment
//         // key={`Wrapper.${index}`}
//         >
//             <Panel className={styles.Panel}>
//                 <PanelGroup
//                     //id={`PanelGroup.${index}.${n.direction}`}
//                     direction={children.direction}
//                     //style={{ overflow: 'initial!important' }}
//                 >
//                     {renderLayout(children)}
//                 </PanelGroup>
//             </Panel>
//             {/*<ResizeHandle />*/}
//             {/*PanelGroup: {n.id}*/}
//             {children.children ? <ResizeHandle /> : null}
//         </React.Fragment>
//     )
// }

type RenderLayoutPropsType = {
    node: NodeType
    dispatch: any
}

function RenderLayout({ node, dispatch }: RenderLayoutPropsType) {
    //console.log('node', node)
    //const dispatch = useAppDispatch()
    //const activeId = useAppSelector((state) => state.flex.activeId)
    if (!Array.isArray(node.children)) return undefined
    if (Array.isArray(node.children) && node.children.length === 0) {
        return <div className={styles.emptyBox}>Empty</div>
    }
    return node.children.map((n, index, array) => {
        if (Array.isArray(n.children) && n.direction) {
            return (
                <React.Fragment key={`Wrapper.${index}`}>
                    {index > 0 && (
                        <ResizeHandle className={styles.resizeHandleWrapper} />
                    )}
                    <Panel className={styles.Panel}>
                        <PanelGroup direction={n.direction}>
                            {RenderLayout({ node: n, dispatch })}
                        </PanelGroup>
                    </Panel>
                </React.Fragment>
            )
        }
        const removeItem = () => {
            dispatch(removeItemInRowFlexBeta(n))
        }
        const divideItem = () => {
            dispatch(divideItemInRowFlexBeta(n))
        }
        // const changeItemActiveId = () => {
        //     console.log(activeId === n.id)
        //     dispatch(
        //         setActiveItemId(
        //             //@ts-ignore
        //             activeId === n.children.url ? '' : n.children.url
        //         )
        //     )
        // }

        // const swapItemsForActiveId = () => {
        //     //@ts-ignore
        //     dispatch(setSwapItemsForActiveId(n.children.url))
        // }

        return (
            <React.Fragment key={`Wrapper.${index}`}>
                {index > 0 && (
                    <ResizeHandle
                        className={styles.resizeHandleWrapper}
                        //@ts-ignore
                        index={+n.children.url}
                    />
                )}

                <Panel key={`L.${index}`} className={styles.Panel}>
                    <div className={styles.PanelContent}>
                        <div className={styles.del}>
                            <button onClick={removeItem}>del</button>
                        </div>
                        <div className={styles.divideBox}>
                            <button onClick={divideItem}>divide</button>
                        </div>
                        {/*<div className={styles.swapperBox}>*/}
                        {/*    {!activeId && (*/}
                        {/*        <button onClick={changeItemActiveId}>*/}
                        {/*            swap*/}
                        {/*        </button>*/}
                        {/*    )}*/}
                        {/*    {!(activeId === n.id) && (*/}
                        {/*        <button onClick={swapItemsForActiveId}>*/}
                        {/*            swap!!!!*/}
                        {/*        </button>*/}
                        {/*    )}*/}
                        {/*</div>*/}
                        {/*//@ts-ignore*/}
                        {n.children.url === null ? (
                            <div
                                className={styles.emptyImgBox}
                                onDrop={(e) => {
                                    const data =
                                        e.dataTransfer.getData('text_file')

                                    console.log('data', data)
                                    dispatch(
                                        addUrlItemInRowFlexBeta({
                                            id: n.id,
                                            url: data,
                                        })
                                    )
                                }}
                                onDragOver={(e) => {
                                    e.preventDefault()
                                }}
                            >
                                <div>Empty img</div>
                                <div>{n.id}</div>
                            </div>
                        ) : (
                            <div>
                                <div>{n.id}</div>
                                <img
                                    width={'100%'}
                                    src={
                                        //@ts-ignore
                                        n.children.url
                                    }
                                    alt=""
                                />
                            </div>
                        )}
                    </div>
                </Panel>
                {/*{index === array.length - 1 && (*/}
                {/*    <ResizeHandle className={styles.resizeHandleWrapper} />*/}
                {/*)}*/}
            </React.Fragment>
        )
    })
}
export const FlexLayoutBeta = ({}: PropsWithChildren<FlexLayoutPropsType>) => {
    const layout = useAppSelector((state) => state.flex.layout)
    const root = useAppSelector((state) => state.flex.root)
    const dispatch = useAppDispatch()

    const addRow = () => {
        dispatch(addNewRowFlexBeta())
    }
    //console.log('layout', layout)
    return (
        <div className={styles.ContainerLayout}>
            <div className={styles.Container}>
                <div className={styles.BottomRow}>
                    <RenderRootLayoutFlexBeta layout={layout} />
                </div>
                <div>
                    <button onClick={addRow}>add Row</button>
                </div>
            </div>
            <ImageData />
        </div>
    )
}

type RenderRootLayoutFlexBetaType = {
    layout: NodeType[]
}

const RenderRootLayoutFlexBeta = ({ layout }: RenderRootLayoutFlexBetaType) => {
    const dispatch = useAppDispatch()
    return (
        <>
            {layout.map((row, index) => {
                const addItemInRow = () => {
                    if (Array.isArray(row.children) && row.children.length >= 6)
                        return
                    dispatch(addItemInRowFlexBeta(row.id))
                }
                return (
                    <PanelGroup
                        key={`PanelGroup.${index}`}
                        autoSaveId={`example.${index}`}
                        direction={'horizontal'}
                        className={styles.MainRow}
                    >
                        <div className={styles.ButtonRowAddItem}>
                            {!(
                                Array.isArray(row.children) &&
                                row.children.length >= 6
                            ) && (
                                <button onClick={addItemInRow}>add item</button>
                            )}
                        </div>

                        {RenderLayout({ node: row, dispatch })}
                    </PanelGroup>
                )
            })}
        </>
    )
}

const ImageData = () => {
    const [fileList, setFileList] = useState<File[]>()
    const [imgList, setImgList] = useState<string[]>([])
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
            const objectUrl = URL.createObjectURL(file)
            setImgList((prev) => [...prev, objectUrl])
        })

        // free memory when ever this component is unmounted
        return () => {
            //URL.revokeObjectURL(objectUrl)
            imgList.forEach((file) => {
                URL.revokeObjectURL(file)
            })
        }
    }, [fileList?.length])
    //console.log('imgList', imgList)
    const [isOpen, setIsOpen] = useState(true)
    return (
        <div className={styles.imageData}>
            <div className={styles.imageLibOpener}>
                <button
                    onClick={() => {
                        setIsOpen(!isOpen)
                    }}
                >
                    opener
                </button>
            </div>

            {isOpen && (
                <>
                    <div>
                        <input type="file" multiple onChange={onChangeFile} />
                    </div>
                    <div className={styles.imagesPreview}>
                        {imgList.map((file, index) => {
                            return (
                                <div key={`img.${index}`}>
                                    <img
                                        src={file}
                                        alt=""
                                        draggable
                                        onDragStart={(ev) => {
                                            console.log('onDrag')
                                            //ev.preventDefault()
                                            ev.stopPropagation()
                                            ev.dataTransfer.setData(
                                                'text_file',
                                                file
                                            )
                                        }}
                                    />
                                </div>
                            )
                        })}
                    </div>
                </>
            )}
        </div>
    )
}
