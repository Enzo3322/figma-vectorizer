import { NextRequest, NextResponse } from 'next/server';
import { vectorize } from '@/lib/vectorizer/vectorize';
import { optimizeSVG, validateFigmaCompatibility } from '@/lib/vectorizer/svg-optimizer';
import { VectorizeOptions } from '@/types/vectorization';
import { getUploadedFile } from '@/lib/upload-store';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { fileId, options } = body as {
      fileId?: string;
      buffer?: string; // base64 encoded
      options: VectorizeOptions;
    };

    let imageBuffer: Buffer;

    // Get image buffer from uploaded file or from request
    if (fileId) {
      const uploadedFile = getUploadedFile(fileId);
      if (!uploadedFile) {
        return NextResponse.json(
          { error: 'File not found. File may have expired.' },
          { status: 404 }
        );
      }
      imageBuffer = uploadedFile.buffer;
    } else if (body.buffer) {
      // Support direct buffer upload (base64)
      imageBuffer = Buffer.from(body.buffer, 'base64');
    } else {
      return NextResponse.json(
        { error: 'No file ID or buffer provided' },
        { status: 400 }
      );
    }

    // Validate options
    if (!options) {
      return NextResponse.json(
        { error: 'Vectorization options required' },
        { status: 400 }
      );
    }

    // Set defaults
    const vectorizeOptions: VectorizeOptions = {
      colorMode: options.colorMode || 'bw',
      detailLevel: options.detailLevel ?? 70,
      smoothness: options.smoothness ?? 50,
      threshold: options.threshold ?? 128,
      maxColors: options.maxColors ?? 16,
    };

    // Vectorize image
    const result = await vectorize(imageBuffer, vectorizeOptions);

    // Optimize SVG
    const optimizationLevel = 50; // Default medium optimization
    const optimizedSVG = optimizeSVG(result.svg, { level: optimizationLevel });

    // Validate Figma compatibility
    const compatibility = validateFigmaCompatibility(optimizedSVG);

    // Return result
    return NextResponse.json({
      success: true,
      svg: optimizedSVG,
      metadata: {
        ...result.metadata,
        optimizedSize: Buffer.byteLength(optimizedSVG, 'utf8'),
        compressionRatio: (
          (1 - Buffer.byteLength(optimizedSVG, 'utf8') / result.metadata.svgSize) *
          100
        ).toFixed(1),
      },
      figmaCompatibility: compatibility,
    });
  } catch (error) {
    console.error('Vectorization error:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Vectorization failed',
      },
      { status: 500 }
    );
  }
}

// Health check endpoint
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    service: 'vectorization',
    version: '1.0.0',
  });
}
