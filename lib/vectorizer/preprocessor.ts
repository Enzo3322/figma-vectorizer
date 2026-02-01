import sharp from 'sharp';
import { ColorMode } from '@/types/vectorization';

export interface PreprocessOptions {
  colorMode: ColorMode;
  threshold?: number;
  maxDimension?: number;
}

export interface PreprocessResult {
  buffer: Buffer;
  width: number;
  height: number;
  format: string;
}

/**
 * Preprocess image for vectorization
 * - Resize if too large
 * - Convert color mode (B&W, grayscale, or color)
 * - Apply threshold for B&W mode
 */
export async function preprocessImage(
  inputBuffer: Buffer,
  options: PreprocessOptions
): Promise<PreprocessResult> {
  const {
    colorMode,
    threshold = 128,
    maxDimension = 2048,
  } = options;

  let pipeline = sharp(inputBuffer);

  // Get metadata
  const metadata = await pipeline.metadata();
  const { width = 0, height = 0 } = metadata;

  // Resize if too large
  if (width > maxDimension || height > maxDimension) {
    pipeline = pipeline.resize(maxDimension, maxDimension, {
      fit: 'inside',
      withoutEnlargement: true,
    });
  }

  // Apply color mode transformations
  switch (colorMode) {
    case 'bw':
      // Convert to black and white with threshold
      pipeline = pipeline
        .greyscale()
        .threshold(threshold)
        .toColorspace('b-w');
      break;

    case 'grayscale':
      // Convert to grayscale
      pipeline = pipeline.greyscale();
      break;

    case 'color':
      // Keep color, but ensure RGB
      pipeline = pipeline.toColorspace('srgb');
      break;
  }

  // Convert to PNG for consistent processing
  pipeline = pipeline.png();

  // Execute pipeline
  const buffer = await pipeline.toBuffer();
  const processedMetadata = await sharp(buffer).metadata();

  return {
    buffer,
    width: processedMetadata.width || width,
    height: processedMetadata.height || height,
    format: 'png',
  };
}

/**
 * Analyze image to suggest optimal threshold for B&W conversion
 */
export async function analyzeImageThreshold(
  inputBuffer: Buffer
): Promise<number> {
  try {
    const { data, info } = await sharp(inputBuffer)
      .greyscale()
      .raw()
      .toBuffer({ resolveWithObject: true });

    // Calculate histogram
    const histogram = new Array(256).fill(0);
    for (let i = 0; i < data.length; i++) {
      histogram[data[i]]++;
    }

    // Use Otsu's method to find optimal threshold
    const total = info.width * info.height;
    let sum = 0;
    for (let i = 0; i < 256; i++) {
      sum += i * histogram[i];
    }

    let sumB = 0;
    let wB = 0;
    let wF = 0;
    let maxVariance = 0;
    let threshold = 0;

    for (let i = 0; i < 256; i++) {
      wB += histogram[i];
      if (wB === 0) continue;

      wF = total - wB;
      if (wF === 0) break;

      sumB += i * histogram[i];

      const mB = sumB / wB;
      const mF = (sum - sumB) / wF;

      const variance = wB * wF * (mB - mF) * (mB - mF);

      if (variance > maxVariance) {
        maxVariance = variance;
        threshold = i;
      }
    }

    return Math.round(threshold);
  } catch (error) {
    console.error('Error analyzing threshold:', error);
    return 128; // Default fallback
  }
}
