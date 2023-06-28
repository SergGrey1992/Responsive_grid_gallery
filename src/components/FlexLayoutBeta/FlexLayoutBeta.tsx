import type { PropsWithChildren } from 'react'
import React, { useEffect, useState } from 'react'
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels'

import { useAppDispatch, useAppSelector } from '../../hooks'
import { addRowInFlexLayout } from '../../store/reducers'
import { NODETYPE } from '../../store/reducers/flexLayoutBeta/flexLayoutBeta'

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

//<PanelGroup autoSaveId="example" direction={"vertical"}>
function renderLayout(node: NODETYPE) {
    if (node.children == null) return

    return node.children.map((n, index, array) => {
        renderLayout(n)

        if (n.root && !(n.direction === 'none')) {
            //renderLayout(n)
            return (
                <PanelGroup
                    id={`PanelGroup.${index}.${n.direction}`}
                    direction={n.direction}
                    key={`L.${index}`}
                >
                    {renderLayout(n)}
                </PanelGroup>
            )
        }

        //console.log(n.id)
        return (
            <>
                <Panel key={`L.${index}`} className={styles.Panel}>
                    <div className={styles.PanelContent}>
                        <img
                            width={'100%'}
                            src={
                                'https://img.freepik.com/free-photo/a-cupcake-with-a-strawberry-on-top-and-a-strawberry-on-the-top_1340-35087.jpg'
                            }
                            alt=""
                        />
                    </div>
                </Panel>
                {node.children![index + 1] && <ResizeHandle />}
            </>
        )
    })
}

export const FlexLayoutBeta = ({}: PropsWithChildren<FlexLayoutPropsType>) => {
    const layout = useAppSelector((state) => state.flex.layout)
    const dispatch = useAppDispatch()
    const addRow = () => {
        dispatch(addRowInFlexLayout())
    }
    //console.log('layout', layout)
    return (
        <div className={styles.ContainerLayout}>
            <div className={styles.Container}>
                <div className={styles.BottomRow}>
                    <PanelGroup direction={'vertical'}>
                        {renderLayout(layout)}
                    </PanelGroup>
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
