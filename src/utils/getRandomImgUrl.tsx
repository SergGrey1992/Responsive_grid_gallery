import { faker } from '@faker-js/faker'
export const getRandomImgUrl = () => {
    return faker.image.urlLoremFlickr()
}

export function makeRandomizer([min, max]: any) {
    const numbers = Array.from({ length: max - min + 1 }, (n, i) => min + i)

    for (let i = numbers.length; --i > 0; ) {
        const j = (Math.random() * (i + 1)) | 0
        ;[numbers[i], numbers[j]] = [numbers[j], numbers[i]]
    }

    return () => numbers.pop() ?? null
}
