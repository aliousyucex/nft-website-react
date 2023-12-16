export function createImage(imageSrc: string) {
    const image = new Image();
    image.src = imageSrc;
    return image;
}
