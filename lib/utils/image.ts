const resizeImage = (url: string, width: number) => {
  return url.replace('s0', `s${width}`);
};

const resizeMultipleImages = (images: string[], width: number) => {
  return images.map((image) => resizeImage(image, width));
};

export { resizeImage, resizeMultipleImages };
