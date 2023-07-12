import React, { useCallback } from 'react'
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels'

import { useAppDispatch } from '../../hooks'
import { useClickAndDoubleClick } from '../../hooks/useClickAndDoubleClick'
import {
    addItemInRowFlexBeta,
    addUrlItemInRowFlexBeta,
    divideItemInRowFlexBeta,
    ElementType,
    InitialStateType,
    removeItemInRowFlexBeta,
} from '../../store/reducers/flexLayoutBeta/flexLayoutBeta'

import { ImgListType } from './FlexLayoutBeta'

import styles from './styles.module.css'

interface CurrentFlexRowPropsType extends InitialStateType {}

type ResizeHandlePropsType = {
    className?: string
    id?: string
}

export const ResizeHandle = ({ className = '', id }: ResizeHandlePropsType) => {
    return (
        <PanelResizeHandle
            className={[styles.ResizeHandleOuter, className].join(' ')}
            id={id}
        >
            <div
                className={styles.ResizeHandleInner}
                onMouseUp={() => {
                    console.log('onMouseUp')
                }}
            >
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

export const CurrentFlexRow = ({
    id,
    order,
    type,
    rowLayout,
}: CurrentFlexRowPropsType) => {
    const dispatch = useAppDispatch()
    const addItemInRow = () => {
        //todo
        // if (Array.isArray(row.children) && row.children.length >= 6)
        //     return
        if (type === 'row') {
            // max 6 items
            dispatch(addItemInRowFlexBeta(id))
            return
        }
        if (type === 'slider') {
            //max infinity items
            dispatch(addItemInRowFlexBeta(id))
            return
        }
        //dispatch(addItemInRowFlexBeta(id))
    }
    const copy = [...rowLayout]
    return (
        <PanelGroup direction={'horizontal'} className={styles.MainRow}>
            <div className={styles.ButtonRowAddItem}>
                <button onClick={addItemInRow}>+</button>
            </div>
            {rowLayout.length === 0 ? (
                <div className={styles.emptyBox}>Empty</div>
            ) : (
                [...mapperData(copy)].map((el, index, array) => {
                    return (
                        <React.Fragment
                            key={`Element.${index}`}
                            // style={{ minHeight: 200 }}
                        >
                            <Panel className={styles.Panel}>
                                <PanelGroup direction={'vertical'}>
                                    <RenderWrapper el={el} rowId={id} />
                                </PanelGroup>
                            </Panel>
                            {!(array.length - 1 === index) && <ResizeHandle />}
                        </React.Fragment>
                    )
                })
            )}
        </PanelGroup>
    )
}

const mapperData = (
    rowLayout: ElementType[]
): (ElementType | ElementType[])[] => {
    const result: (ElementType | ElementType[])[] = []
    let groupEl: ElementType[] = []
    rowLayout.forEach((row) => {
        if (row.nestedOrder === null) {
            result.push(row)
        } else {
            if (row.nestedOrder) {
                groupEl.push(row)
                if (row.nestedOrder === 2) {
                    result.push(groupEl)
                    groupEl = []
                }
            }
        }
    })
    return result
}

type RenderWrapperPropsType = {
    el: ElementType | ElementType[]
    rowId: string
}

const RenderWrapper = ({ el, rowId }: RenderWrapperPropsType) => {
    const dispatch = useAppDispatch()
    if (Array.isArray(el)) {
        return (
            <>
                {el.map((ell, index, array) => {
                    const removeItem = () => {
                        dispatch(
                            removeItemInRowFlexBeta({ rowId, itemId: ell.id })
                        )
                    }
                    const divideItem = () => {
                        dispatch(
                            divideItemInRowFlexBeta({ rowId, itemId: ell.id })
                        )
                    }
                    return (
                        <React.Fragment
                            key={`Element.${index}`}
                            // style={{ minHeight: 200 }}
                        >
                            <Panel className={styles.PanelGroup}>
                                <div className={styles.PanelContent}>
                                    {ell.file === null ? (
                                        <EmptyImageRender
                                            rowId={rowId}
                                            id={ell.id}
                                            onClick={removeItem}
                                            onDoubleClick={divideItem}
                                        />
                                    ) : (
                                        <ImageRender
                                            id={ell.id}
                                            url={ell.file.originalUrl}
                                            type={ell.file.type}
                                            onClick={removeItem}
                                            onDoubleClick={divideItem}
                                        />
                                    )}
                                </div>
                            </Panel>
                            {!(array.length - 1 === index) && <ResizeHandle />}
                        </React.Fragment>
                    )
                })}
            </>
            // </PanelGroup>
        )
    }

    const removeItem = () => {
        console.log('CALL removeItem')
        dispatch(removeItemInRowFlexBeta({ rowId, itemId: el.id }))
    }
    const divideItem = () => {
        console.log('CALL divideItem')
        dispatch(divideItemInRowFlexBeta({ rowId, itemId: el.id }))
    }
    // const [handleClick, handleDoubleClick] = useClickPreventionOnDoubleClick(
    //     onClick: removeItem,
    //     onDoubleClick: divideItem,
    // )
    return (
        <div className={styles.PanelContent}>
            {el.file === null ? (
                <EmptyImageRender
                    rowId={rowId}
                    id={el.id}
                    onClick={removeItem}
                    onDoubleClick={divideItem}
                />
            ) : (
                <ImageRender
                    id={el.id}
                    url={el.file.originalUrl}
                    type={el.file.type}
                    onClick={removeItem}
                    onDoubleClick={divideItem}
                />
            )}
        </div>
    )
}

type ImageRenderPropsType = {
    url: string
    type: 'image' | 'video'
    id: string
    onClick: (param?: any) => void
    onDoubleClick: (param: any) => void
}

const ImageRender = ({
    url,
    type,
    id,
    onClick,
    onDoubleClick,
}: ImageRenderPropsType) => {
    const handleClick = useClickAndDoubleClick(onClick, onDoubleClick)
    return (
        <div
            style={{ width: '100%', height: '100%' }}
            onClick={() => {
                console.log('img')
                handleClick('img')
            }}
            //onDoubleClick={handleDoubleClick}
        >
            {type === 'image' ? (
                <img width={'100%'} src={url} alt="" />
            ) : (
                <video
                    width={'100%'}
                    src={url}
                    muted
                    autoPlay
                    playsInline
                    controls
                />
            )}
        </div>
    )
}

type EmptyImageRenderPropsType = {
    rowId: string
    id: string
    onClick: (param: any) => void
    onDoubleClick: (param: any) => void
}

const EmptyImageRender = React.memo(
    ({ rowId, id, onClick, onDoubleClick }: EmptyImageRenderPropsType) => {
        const dispatch = useAppDispatch()
        const handleClick = useClickAndDoubleClick(onClick, onDoubleClick)
        const handlerDrag = useCallback(
            (e: React.DragEvent<HTMLDivElement>) => {
                const data = e.dataTransfer.getData('text_file')
                const parseData = JSON.parse(data) as ImgListType
                dispatch(
                    addUrlItemInRowFlexBeta({
                        rowId,
                        id,
                        url: parseData.url,
                        type: parseData.type.includes('video')
                            ? 'video'
                            : 'image',
                    })
                )
            },
            []
        )
        return (
            <div
                className={styles.emptyImgBox}
                onClick={() => {
                    handleClick()
                }}
                onDrop={handlerDrag}
                onDragOver={(e) => {
                    e.preventDefault()
                }}
            >
                <div style={{ color: '#808080' }}>Add a file here</div>
                {/*<div>{id}</div>*/}
            </div>
        )
    }
)
