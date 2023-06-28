import { createSlice } from '@reduxjs/toolkit'

type InitStateType = {
    layout: NODETYPE
}

//     0
//   1    4
// 2  3  5  6

export type Direction = 'horizontal' | 'vertical'

export type NODETYPE = {
    id: number
    direction: Direction | 'none'
    data: {
        url: string
    } | null
    children: NODETYPE[] | null
    root: boolean
}

const rootNode: NODETYPE = {
    // в данной ноде её children это строки сетки
    id: 0,
    data: null,
    children: [
        {
            // row
            id: 1,
            children: [
                {
                    id: 8,
                    children: null,
                    direction: 'none',
                    data: {
                        url: '',
                    },
                    root: false,
                },
                {
                    id: 7,
                    children: null,
                    direction: 'none',
                    data: {
                        url: '',
                    },
                    root: false,
                },
                {
                    id: 2,
                    children: null,
                    direction: 'none',
                    data: {
                        url: '',
                    },
                    root: false,
                },
                {
                    id: 3,
                    children: null,
                    direction: 'none',
                    root: false,
                    data: {
                        url: '',
                    },
                },
            ],
            data: null,
            direction: 'horizontal',
            root: true,
        },

        // row
        {
            id: 4,
            children: [
                {
                    id: 5,
                    children: null,
                    direction: 'none',
                    root: false,
                    data: {
                        url: '',
                    },
                },
                {
                    id: 6,
                    children: null,
                    direction: 'none',
                    root: false,
                    data: {
                        url: '',
                    },
                },
            ],
            data: null,
            direction: 'vertical',
            root: true,
        },
    ],
    direction: 'horizontal',
    root: true,
}

function postOrder(node: NODETYPE) {
    if (node.children == null) return

    return node.children.map((n) => {
        postOrder(n)
        console.log(n.id)
        return
    })
}

postOrder(rootNode)

const initState: InitStateType = {
    layout: rootNode,
}

const flexLayoutBeta = createSlice({
    name: 'flexLayoutBeta',
    initialState: initState,
    reducers: {},
})

export const flexReducer = flexLayoutBeta.reducer
export const {} = flexLayoutBeta.actions
