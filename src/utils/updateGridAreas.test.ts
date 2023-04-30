import { ItemTypeWithOrder } from '../types/types'

import { updateGridAreas } from './updateGrisAreas'

describe('full testing right increment row', () => {
    describe('updateGridAreas', () => {
        let initialGridAreas: ItemTypeWithOrder[]
        beforeEach(() => {
            initialGridAreas = [
                { gridArea: '1/1/2/11' },
                { gridArea: '1/11/3/21' },
                { gridArea: '1/21/2/31' },
                { gridArea: '2/21/4/31' },
                { gridArea: '2/31/3/41' },
                { gridArea: '3/31/4/41' },
            ] as any
        })
        test('should correctly update grid areas and shift affected elements', () => {
            const expectedGridAreas = [
                { gridArea: '1/1/2/11' },
                { gridArea: '1/11/3/26' },
                { gridArea: '1/26/2/36' },
                { gridArea: '2/26/4/36' },
                { gridArea: '2/36/3/46' },
                { gridArea: '3/36/4/46' },
            ] as ItemTypeWithOrder[]

            const indexToUpdate = 1
            const increaseBy = 5

            const updatedGridAreas = updateGridAreas(
                initialGridAreas,
                indexToUpdate,
                increaseBy
            )

            expect(updatedGridAreas).toEqual(expectedGridAreas)
        })
        test('variable 1', () => {
            //'1/1/2/11',
            //'1/11/3/21',
            //'1/21/2/31',
            //'2/21/4/31',
            //'2/31/3/41',
            //'3/31/4/41',
            const expectedGridAreas = [
                { gridArea: '1/1/2/16' }, //1/1/2/11',
                { gridArea: '1/16/3/26' }, //'1/11/3/26',
                { gridArea: '1/26/2/36' }, //'1/26/2/36',
                { gridArea: '2/26/4/36' }, //'2/26/4/36',
                { gridArea: '2/36/3/46' }, //'2/36/3/46',
                { gridArea: '3/36/4/46' }, //'3/36/4/46',
            ]
            const indexToUpdate = 0
            const increaseBy = 5

            const updatedGridAreas = updateGridAreas(
                initialGridAreas,
                indexToUpdate,
                increaseBy
            )

            expect(updatedGridAreas).toEqual(expectedGridAreas)
        })
        test('variable 2', () => {
            //'1/1/2/11',
            //'1/11/3/21',
            //'1/21/2/31',
            //'2/21/4/31',
            //'2/31/3/41',
            //'3/31/4/41',
            const expectedGridAreas = [
                { gridArea: '1/1/2/11' },
                { gridArea: '1/11/3/21' },
                { gridArea: '1/21/2/36' },
                { gridArea: '2/21/4/31' },
                { gridArea: '2/31/3/41' },
                { gridArea: '3/31/4/41' },
            ]
            const indexToUpdate = 2
            const increaseBy = 5

            const updatedGridAreas = updateGridAreas(
                initialGridAreas,
                indexToUpdate,
                increaseBy
            )

            expect(updatedGridAreas).toEqual(expectedGridAreas)
        })
        test('variable 3', () => {
            //'1/1/2/11',
            //'1/11/3/21',
            //'1/21/2/31',
            //'2/21/4/31',
            //'2/31/3/41',
            //'3/31/4/41',
            const expectedGridAreas = [
                { gridArea: '1/1/2/11' },
                { gridArea: '1/11/3/21' },
                { gridArea: '1/21/2/31' },
                { gridArea: '2/21/4/36' },
                { gridArea: '2/36/3/46' },
                { gridArea: '3/36/4/46' },
            ]
            const indexToUpdate = 3
            const increaseBy = 5

            const updatedGridAreas = updateGridAreas(
                initialGridAreas,
                indexToUpdate,
                increaseBy
            )

            expect(updatedGridAreas).toEqual(expectedGridAreas)
        })
        test('variable 5', () => {
            const expectedGridAreas = [
                { gridArea: '1/1/2/11' },
                { gridArea: '1/11/3/41' },
                { gridArea: '1/41/2/51' },
                { gridArea: '2/41/4/51' },
                { gridArea: '2/51/3/61' },
                { gridArea: '3/51/4/61' },
            ]
            const indexToUpdate = 1
            const increaseBy = 20

            const updatedGridAreas = updateGridAreas(
                initialGridAreas,
                indexToUpdate,
                increaseBy
            )
            expect(updatedGridAreas).toEqual(expectedGridAreas)
        })
    })

    describe('looping testing', () => {
        let initialGridAreas: ItemTypeWithOrder[] = []
        beforeEach(() => {
            initialGridAreas = [
                { gridArea: '1/1/2/11' },
                { gridArea: '1/11/3/21' },
                { gridArea: '1/21/2/31' },
                { gridArea: '2/21/4/31' },
                { gridArea: '2/31/3/41' },
                { gridArea: '3/31/4/41' },
            ] as any
        })
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j <= 19; j++) {
                test(`looping testing index ${i} увеличение элемента на ${j}`, () => {
                    const updatedGridAreas = updateGridAreas(
                        initialGridAreas,
                        i,
                        j
                    )
                    expect(+updatedGridAreas[i].gridArea.split('/')[3]).toEqual(
                        +initialGridAreas[i].gridArea.split('/')[3] + j
                    )
                })
            }
        }
    })
})
