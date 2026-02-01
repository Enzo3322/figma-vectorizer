import Potrace from 'potrace';
import { VectorizeOptions, VectorizationResult } from '@/types/vectorization';
import { preprocessImage } from './preprocessor';

/**
 * Vectorize an image using Potrace
 */
export async function vectorizeImage(
  inputBuffer: Buffer,
  options: VectorizeOptions
): Promise<VectorizationResult> {
  const startTime = Date.now();

  // Preprocess image based on options
  const preprocessed = await preprocessImage(inputBuffer, {
    colorMode: options.colorMode,
    threshold: options.threshold,
  });

  // Configure Potrace parameters
  const potraceOptions = {
    // Higher turdsize = less detail (smoother curves)
    turdsize: Math.round((100 - options.detailLevel) / 5),
    // Lower turnpolicy = sharper corners
    turnpolicy: options.smoothness > 50 ? 'minority' : 'majority',
    // Optimization tolerance (0 = precise, higher = simplified)
    optTolerance: options.smoothness / 100,
    // Alpha max for optimization
    alphamax: 1 + (options.smoothness / 50),
  };

  return new Promise((resolve, reject) => {
    Potrace.trace(preprocessed.buffer, potraceOptions, (err, svg) => {
      if (err) {
        reject(new Error(`Vectorization failed: ${err.message}`));
        return;
      }

      const processingTime = Date.now() - startTime;

      // Extract metadata from SVG
      const pathCount = (svg.match(/<path/g) || []).length;
      const svgSize = Buffer.byteLength(svg, 'utf8');

      const result: VectorizationResult = {
        svg,
        metadata: {
          originalSize: inputBuffer.length,
          svgSize,
          pathCount,
          colorCount: options.colorMode === 'bw' ? 2 : (options.colorMode === 'grayscale' ? 256 : 0),
          processingTime,
        },
      };

      resolve(result);
    });
  });
}

/**
 * Vectorize color images by separating into color layers
 * Note: Basic implementation - can be enhanced with better color quantization
 */
export async function vectorizeColorImage(
  inputBuffer: Buffer,
  options: VectorizeOptions
): Promise<VectorizationResult> {
  const startTime = Date.now();

  // For color vectorization, we'll use a simple approach:
  // 1. Convert to limited color palette
  // 2. Vectorize each color layer separately
  // 3. Combine into single SVG

  // For MVP, we'll convert to grayscale and vectorize
  // TODO: Implement proper color layer separation
  const grayscaleOptions: VectorizeOptions = {
    ...options,
    colorMode: 'grayscale',
  };

  const result = await vectorizeImage(inputBuffer, grayscaleOptions);
  result.metadata.processingTime = Date.now() - startTime;

  return result;
}

/**
 * Main vectorization function that routes to appropriate method
 */
export async function vectorize(
  inputBuffer: Buffer,
  options: VectorizeOptions
): Promise<VectorizationResult> {
  // Validate options
  if (options.detailLevel < 0 || options.detailLevel > 100) {
    throw new Error('Detail level must be between 0 and 100');
  }

  if (options.smoothness < 0 || options.smoothness > 100) {
    throw new Error('Smoothness must be between 0 and 100');
  }

  // Route to appropriate vectorization method
  switch (options.colorMode) {
    case 'color':
      return vectorizeColorImage(inputBuffer, options);
    case 'bw':
    case 'grayscale':
    default:
      return vectorizeImage(inputBuffer, options);
  }
}
