
export interface WorldGridConfig {
  imageCount: number;
  radius: number;
  imageSize: number;
  rotationSpeed: number;
  backgroundColor: string;
  minZoom: number;
  maxZoom: number;
  showLightbox: boolean;
}

export interface ImageData {
  url: string;
  alt: string;
  id: number;
}
