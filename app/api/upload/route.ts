import { NextRequest, NextResponse } from 'next/server';
import { validateImageFile } from '@/lib/utils/validation';

// Store uploaded files in memory (simple MVP approach)
// In production, consider using a database or cloud storage
const uploadedFiles = new Map<string, { buffer: Buffer; metadata: any }>();

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file
    const validation = validateImageFile(file);
    if (!validation.isValid) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      );
    }

    // Convert to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Generate unique file ID
    const fileId = `${Date.now()}-${file.name}`;

    // Store in memory
    uploadedFiles.set(fileId, {
      buffer,
      metadata: {
        name: file.name,
        size: file.size,
        type: file.type,
        uploadedAt: new Date().toISOString(),
      },
    });

    // Clean up old files after 30 minutes
    setTimeout(() => {
      uploadedFiles.delete(fileId);
    }, 30 * 60 * 1000);

    return NextResponse.json({
      success: true,
      fileId,
      metadata: {
        name: file.name,
        size: file.size,
        type: file.type,
      },
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    );
  }
}

// Export function to retrieve uploaded files
export function getUploadedFile(fileId: string) {
  return uploadedFiles.get(fileId);
}
