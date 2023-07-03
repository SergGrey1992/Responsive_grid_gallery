import {
    createEntityAdapter,
    createSlice,
    PayloadAction,
} from '@reduxjs/toolkit'
import { v1 } from 'uuid'

type InitStateType = {
    layout: NodeType[]
    root: NodeType[]
    activeId: string
}

//     0
//   1    4
// 2  3  5  6

export type Direction = 'horizontal' | 'vertical'

export type DataType = { url: string }

export type NODETYPE = {
    id: number
    direction?: Direction
    // data?: {
    //     url: string
    // }
    children: NODETYPE[] | DataType
}

const rootNode: NODETYPE = {
    // в данной ноде её children это строки сетки
    /**
     * точка входа она всегда горизонтальная
     * делим всю область на кол-во children
     */
    id: 0,
    children: [
        {
            id: 1,
            children: [
                {
                    id: 8,
                    children: [
                        {
                            id: 12,
                            children: { url: '1' },
                            //direction: 'none',
                            // data: {
                            //     url: '',
                            // },
                            //root: false,
                        },
                        {
                            id: 13,
                            children: { url: '2' },
                            //direction: 'none',
                            //root: false,
                            // data: {
                            //     url: '',
                            // },
                        },
                    ],
                    direction: 'vertical',
                },
                {
                    id: 7,
                    children: { url: '3' },
                },
                {
                    id: 20,
                    children: { url: '4' },
                },
                {
                    id: 2,
                    children: { url: '5' },
                },
                {
                    id: 3,
                    children: { url: '6' },
                },
            ],
            direction: 'horizontal',
        },
        {
            id: 5,
            children: [
                {
                    id: 47,
                    children: { url: '7' },
                    //direction: 'none',
                    // data: {
                    //     url: '',
                    // },
                    //root: false,
                },
                {
                    id: 420,
                    children: { url: '8' },
                    //direction: 'none',
                    // data: {
                    //     url: '',
                    // },
                    //root: false,
                },
            ],
            direction: 'horizontal',
        },
        {
            id: 10,
            children: { url: '9' },
        },
        // row
        // {
        //     id: 4,
        //     children: [
        //         // {
        //         //     id: 6,
        //         //     children: null,
        //         //     direction: 'none',
        //         //     root: false,
        //         //     data: {
        //         //         url: '',
        //         //     },
        //         // },
        //     ],
        //     data: null,
        //     direction: 'vertical',
        //     root: true,
        // },
    ],
    direction: 'horizontal',
}

export type NodeType = {
    id: string
    direction?: Direction
    children: NodeType[] | { url: string | null }
}

const root: NodeType[] = [
    // {
    //     id: v1(),
    //     children: [
    //         {
    //             id: v1(),
    //             children: [
    //                 {
    //                     id: v1(),
    //                     children: { url: '30' },
    //                 },
    //                 {
    //                     id: v1(),
    //                     children: { url: '3' },
    //                 },
    //                 {
    //                     id: v1(),
    //                     direction: 'vertical',
    //                     children: [
    //                         { id: v1(), children: { url: '123' } },
    //                         { id: v1(), children: { url: '123' } },
    //                     ],
    //                 },
    //                 {
    //                     id: v1(),
    //                     children: { url: '5' },
    //                 },
    //                 {
    //                     id: v1(),
    //                     children: { url: '6' },
    //                 },
    //                 {
    //                     id: v1(),
    //                     children: { url: '1' },
    //                 },
    //             ],
    //             direction: 'horizontal',
    //         },
    //     ],
    // },
    // {
    //     id: v1(),
    //     children: [
    //         {
    //             id: v1(),
    //             children: { url: '9' },
    //         },
    //     ],
    // },
    //123
    //123123123123
    // {
    //     id: v1(),
    //     children: [
    //         // {
    //         //     id: v1(),
    //         //     children: [
    //         //         {
    //         //             id: v1(),
    //         //             direction: 'vertical',
    //         //             children: [
    //         //                 {
    //         //                     id: v1(),
    //         //                     children: { url: '7' },
    //         //                 },
    //         //                 {
    //         //                     id: v1(),
    //         //                     children: { url: '8' },
    //         //                 },
    //         //             ],
    //         //         },
    //         //         {
    //         //             id: v1(),
    //         //             children: { url: '8' },
    //         //         },
    //         //     ],
    //         //     direction: 'horizontal',
    //         // },
    //     ],
    // },
]

const root1: NodeType[] = [
    {
        id: v1(),
        children: [
            {
                id: v1(),
                children: [
                    {
                        id: v1(),
                        children: { url: '30' },
                    },
                    {
                        id: v1(),
                        children: { url: '3' },
                    },
                    {
                        id: v1(),
                        direction: 'vertical',
                        children: { url: '7' },
                        // children: [
                        //     { id: v1(), children: { url: '123' } },
                        //     { id: v1(), children: { url: '123' } },
                        // ],
                    },
                    {
                        id: v1(),
                        children: { url: '5' },
                    },
                    {
                        id: v1(),
                        children: { url: '6' },
                    },
                    {
                        id: v1(),
                        children: { url: '1' },
                    },
                ],
                direction: 'horizontal',
            },
        ],
    },
    // {
    //     id: v1(),
    //     children: [
    //         {
    //             id: v1(),
    //             children: { url: '9' },
    //         },
    //     ],
    // },

    // {
    //     id: v1(),
    //     children: [
    //         {
    //             id: v1(),
    //             children: [
    //                 {
    //                     id: v1(),
    //                     direction: 'vertical',
    //                     children: [
    //                         {
    //                             id: v1(),
    //                             children: { url: '7' },
    //                         },
    //                         {
    //                             id: v1(),
    //                             children: { url: '8' },
    //                         },
    //                     ],
    //                 },
    //                 {
    //                     id: v1(),
    //                     children: { url: '8' },
    //                 },
    //             ],
    //             direction: 'horizontal',
    //         },
    //     ],
    // },
]

const initState: InitStateType = {
    layout: root,
    root: root1,
    activeId: '',
}

export type StoredElement = Omit<NodeType, 'elements'> & {
    childIds: string[]
}

export const elementAdapter = createEntityAdapter<StoredElement>()

const recursiveFind = (fullItems: NodeType[], id: string) => {
    console.log(fullItems, 'full')
    const result = fullItems.map((node) => {
        if (Array.isArray(node.children)) {
            recursiveFind(node.children, id)
        }
        if (node.id == id) {
            //node.id = `${id}blabla`
            node.direction = 'vertical'
            node.children = [
                // {...node.children},
                {
                    id: v1(),
                    children: { url: null },
                },
                {
                    id: v1(),
                    children: { url: null },
                },
            ]
        }

        return node
    })
    return result
}

const recursiveAddUrl = (fullItems: NodeType[], id: string, url: string) => {
    return fullItems.map((node) => {
        if (Array.isArray(node.children)) {
            recursiveAddUrl(node.children, id, url)
        }
        if (node.id === id) {
            //@ts-ignore
            node.children.url = url
        }

        return node
    })
}

const getUrl = (fullItems: NodeType[], id: string) => {
    let url = ''
    const el = fullItems.find((node) => {
        if (Array.isArray(node.children)) {
            getUrl(node.children, id)
        }
        return node.id === id
    })
    //console.log('el', JSON.stringify(el, undefined, 2))
    if (el) {
        //@ts-ignore
        url = el.children.url
    }
    return url
}

const recursiveSwapUrl = (
    fullItems: NodeType[],
    firstID: string,
    secondaryID: string
) => {}

const flexLayoutBeta = createSlice({
    name: 'flexLayoutBeta',
    initialState: elementAdapter.getInitialState(initState),
    reducers: {
        //{
        //         id: v1(),
        //         direction: 'horizontal',
        //         children: [+
        //              {
        //                  id: v1(),
        //                  children: [

        //                      {
        //                          id: v1(),
        //                          direction: 'vertical',
        //                          children: [

        //                              {
        //                                  id: v1(),
        //                                  children: { url: '7' },
        //                              },
        //                              {
        //                                  id: v1(),
        //                                  children: { url: '8' },
        //                              },

        //                          ],
        //                      },

        //                      {
        //                          id: v1(),
        //                          children: { url: '8' },
        //                      },

        //                  ],+
        //              },
        //         ],
        //     },
        addNewRowFlexBeta: (state) => {
            state.layout.push({
                id: v1(),
                children: [],
            })
        },
        addItemInRowFlexBeta: (state, action: PayloadAction<string>) => {
            const rowId = action.payload
            const currentRow = state.layout.find((l) => l.id === rowId)
            if (currentRow && Array.isArray(currentRow.children)) {
                currentRow.children.push({
                    id: v1(),
                    //direction: 'vertical',
                    children: { url: null },
                })
            }
        },
        removeItemInRowFlexBeta: (
            state,
            action: PayloadAction<Pick<NodeType, 'id'>>
        ) => {
            //@ts-ignore
            elementAdapter.upsertMany(state, flatten(action))
        },
        divideItemInRowFlexBeta: (
            state,
            action: PayloadAction<Pick<NodeType, 'id'>>
        ) => {
            // работчее
            // const { id } = action.payload
            // const copyState = [...state.layout]
            // const test = recursiveFind(copyState, id)
            // state.layout = test
            const recursiveUpdate = (
                items: NodeType[],
                id: string
            ): NodeType[] => {
                return items.map((item) => {
                    if (item.id === id) {
                        //нашли
                        return {
                            ...item,
                            direction: 'vertical',
                            children: [
                                // {...node.children},
                                {
                                    id: v1(),
                                    children: { url: null },
                                },
                                {
                                    id: v1(),
                                    children: { url: null },
                                },
                            ],
                            //name: newName
                        }
                    } else if (
                        Array.isArray(item.children) &&
                        item.children.length > 0
                    ) {
                        return {
                            ...item,
                            children: recursiveUpdate(
                                item.children,
                                id
                                //newName
                            ),
                        }
                    }
                    return item
                })
            }

            const { id } = action.payload
            state.layout = recursiveUpdate(state.layout, id)
        },
        addUrlItemInRowFlexBeta: (
            state,
            action: PayloadAction<{ id: string; url: string }>
        ) => {
            const { id, url } = action.payload
            const copyState = [...state.layout]
            const test = recursiveAddUrl(copyState, id, url)
            state.layout = test
        },
        //swap
        setActiveItemId: (state, action: PayloadAction<string>) => {
            state.activeId = action.payload
        },
        setSwapItemsForActiveId: (state, action: PayloadAction<string>) => {
            const firstId = state.activeId
            const secondaryId = action.payload
            const copyState = [...state.layout]
            const url1 = getUrl(copyState, firstId)

            console.log('url1', JSON.stringify(url1, undefined, 2))
            const url2 = getUrl(copyState, secondaryId)
            console.log('url2', JSON.stringify(url2, undefined, 2))
            //console.log(firstId, secondaryId)
        },
    },
})

export const flexReducer = flexLayoutBeta.reducer
export const {
    addNewRowFlexBeta,
    addItemInRowFlexBeta,
    removeItemInRowFlexBeta,
    divideItemInRowFlexBeta,
    addUrlItemInRowFlexBeta,
    setActiveItemId,
    setSwapItemsForActiveId,
} = flexLayoutBeta.actions
