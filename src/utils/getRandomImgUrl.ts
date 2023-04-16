export const getRandomImgUrl = (
    width: number,
    height: number,
    random: number
) => {
    return `https://picsum.photos/${width}/${height}?random=${random}`
}
