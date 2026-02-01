'use client';

import { VectorizationResult } from '@/types/vectorization';
import { formatFileSize } from '@/lib/utils/validation';

interface VectorPreviewProps {
  result: VectorizationResult;
}

export default function VectorPreview({ result }: VectorPreviewProps) {
  return (
    <div className="space-y-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl border-2 border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-center min-h-[400px] max-h-[600px] bg-gray-50 dark:bg-gray-900/50 rounded-lg overflow-hidden p-4">
          <div
            className="w-full h-full flex items-center justify-center [&>svg]:max-w-full [&>svg]:max-h-full [&>svg]:w-auto [&>svg]:h-auto"
            dangerouslySetInnerHTML={{ __html: result.svg }}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Paths</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {result.metadata.pathCount}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">SVG Size</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {formatFileSize(result.metadata.svgSize)}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Processing Time</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {result.metadata.processingTime}ms
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Colors</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {result.metadata.colorCount === 0 ? 'Full' : result.metadata.colorCount}
          </p>
        </div>
      </div>
    </div>
  );
}
