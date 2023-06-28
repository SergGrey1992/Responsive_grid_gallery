import type { PropsWithChildren } from 'react'
import React, { useEffect, useState } from 'react'
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels'

import { useAppDispatch, useAppSelector } from '../../hooks'
import {
    addItemInFlexLayoutRow,
    addRowInFlexLayout,
    addUrlInItemFlexLayoutRow,
    removeItemInFlexLayoutRow,
    updatePositionInCellInFlexLayoutRow,
} from '../../store/reducers'
import { PositionInCell } from '../../store/types'

import styles from './styles.module.css'

interface FlexLayoutPropsType {}

export default function ResizeHandle({
    className = '',
    id,
}: {
    className?: string
    id?: string
}) {
    return (
        <PanelResizeHandle
            className={[styles.ResizeHandleOuter, className].join(' ')}
            id={id}
        >
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

export const FlexLayout = ({}: PropsWithChildren<FlexLayoutPropsType>) => {
    const layout = useAppSelector((state) => state.grid.flexLayout)
    const dispatch = useAppDispatch()
    const addRow = () => {
        dispatch(addRowInFlexLayout())
    }
    //console.log('layout', layout)
    return (
        <div className={styles.ContainerLayout}>
            <div className={styles.Container}>
                <div className={styles.BottomRow}>
                    {layout.map((row, index) => {
                        return (
                            <React.Fragment key={`Row.${index}`}>
                                <PanelGroup
                                    autoSaveId="example"
                                    direction={'horizontal'}
                                    style={{ position: 'relative' }}
                                >
                                    {row.map((el, index__) => {
                                        return (
                                            <React.Fragment
                                                key={`Panel.${index__}`}
                                            >
                                                <Panel
                                                    className={styles.Panel}
                                                    //collapsible={true}
                                                    //defaultSize={20}
                                                    //order={1}
                                                >
                                                    {el.url && (
                                                        <div>
                                                            {[
                                                                'center',
                                                                'flex-end',
                                                                'flex-start',
                                                            ].map(
                                                                (
                                                                    self,
                                                                    index___
                                                                ) => {
                                                                    return (
                                                                        <span
                                                                            key={`Self.${index___}`}
                                                                            onClick={() => {
                                                                                dispatch(
                                                                                    updatePositionInCellInFlexLayoutRow(
                                                                                        {
                                                                                            rowIndex:
                                                                                                index,
                                                                                            itemId: el.id,
                                                                                            positionInCell:
                                                                                                self as PositionInCell,
                                                                                        }
                                                                                    )
                                                                                )
                                                                            }}
                                                                        >
                                                                            {
                                                                                self
                                                                            }
                                                                        </span>
                                                                    )
                                                                }
                                                            )}
                                                        </div>
                                                    )}
                                                    <button
                                                        style={{
                                                            position:
                                                                'absolute',
                                                            top: 0,
                                                            right: 0,
                                                            zIndex: 10,
                                                        }}
                                                        onClick={() => {
                                                            console.log(
                                                                'remove => ',
                                                                index,
                                                                el.id
                                                            )
                                                            dispatch(
                                                                removeItemInFlexLayoutRow(
                                                                    {
                                                                        rowIndex:
                                                                            index,
                                                                        itemId: el.id,
                                                                    }
                                                                )
                                                            )
                                                        }}
                                                    >
                                                        --
                                                    </button>
                                                    <div
                                                        className={
                                                            styles.PanelContent
                                                        }
                                                        onDrop={(e) => {
                                                            const data =
                                                                e.dataTransfer.getData(
                                                                    'text_file'
                                                                )

                                                            console.log(
                                                                'data',
                                                                data
                                                            )
                                                            dispatch(
                                                                addUrlInItemFlexLayoutRow(
                                                                    {
                                                                        rowIndex:
                                                                            index,
                                                                        itemId: el.id,
                                                                        url: data,
                                                                    }
                                                                )
                                                            )
                                                        }}
                                                        onDragOver={(e) => {
                                                            e.preventDefault()
                                                        }}
                                                    >
                                                        {el.url ? (
                                                            <img
                                                                width={'100%'}
                                                                src={el.url}
                                                                alt={'123'}
                                                                style={{
                                                                    alignSelf:
                                                                        el.positionInCell,
                                                                }}
                                                            />
                                                        ) : (
                                                            <div
                                                                style={{
                                                                    minHeight: 150,
                                                                }}
                                                            >
                                                                id: {el.id}
                                                            </div>
                                                        )}
                                                    </div>
                                                </Panel>

                                                {!(
                                                    index__ ===
                                                    row.length - 1
                                                ) && <ResizeHandle />}
                                            </React.Fragment>
                                        )
                                    })}
                                    <button
                                        style={{
                                            position: 'absolute',
                                            top: 15,
                                            left: 15,
                                            backgroundColor: 'blue',
                                        }}
                                        onClick={() => {
                                            //console.log('index', index)
                                            dispatch(
                                                addItemInFlexLayoutRow(index)
                                            )
                                        }}
                                    >
                                        Add item
                                    </button>
                                </PanelGroup>
                                {index === layout.length - 1 && (
                                    <div onClick={addRow}>Add New Row</div>
                                )}
                            </React.Fragment>
                        )
                    })}
                    {layout.length === 0 && <div onClick={addRow}>Add Row</div>}
                </div>
            </div>
            <ImageData />
        </div>
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

    return (
        <div className={styles.imageData}>
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
                                    ev.dataTransfer.setData('text_file', file)
                                }}
                            />
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
