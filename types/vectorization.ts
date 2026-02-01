export type ColorMode = 'bw' | 'grayscale' | 'color';

export interface VectorizeOptions {
  colorMode: ColorMode;
  detailLevel: number; // 0-100
  smoothness: number; // 0-100
  threshold?: number; // For B&W mode
  maxColors?: number; // For color mode
}

export interface VectorizationResult {
  svg: string;
  metadata: {
    originalSize: number;
    svgSize: number;
    pathCount: number;
    colorCount: number;
    processingTime: number;
  };
}

export interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  dataUrl: string;
}
