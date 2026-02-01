'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, FileImage } from 'lucide-react';
import { validateImageFile, formatFileSize } from '@/lib/utils/validation';
import { UploadedFile } from '@/types/vectorization';

interface FileDropzoneProps {
  onFileSelect: (file: UploadedFile) => void;
  selectedFile?: UploadedFile;
}

export default function FileDropzone({ onFileSelect, selectedFile }: FileDropzoneProps) {
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setError(null);

    if (acceptedFiles.length === 0) {
      setError('No file selected');
      return;
    }

    const file = acceptedFiles[0];
    const validation = validateImageFile(file);

    if (!validation.isValid) {
      setError(validation.error || 'Invalid file');
      return;
    }

    // Convert to data URL for preview
    const reader = new FileReader();
    reader.onload = (e) => {
      const uploadedFile: UploadedFile = {
        id: `${Date.now()}-${file.name}`,
        name: file.name,
        size: file.size,
        type: file.type,
        dataUrl: e.target?.result as string,
      };
      onFileSelect(uploadedFile);
    };
    reader.readAsDataURL(file);
  }, [onFileSelect]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/png': ['.png'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/webp': ['.webp'],
    },
    maxFiles: 1,
    multiple: false,
  });

  const clearFile = () => {
    setError(null);
    onFileSelect(undefined as any);
  };

  if (selectedFile) {
    return (
      <div className="relative">
        <div className="bg-white dark:bg-gray-800 rounded-xl border-2 border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <img
                src={selectedFile.dataUrl}
                alt={selectedFile.name}
                className="w-24 h-24 object-cover rounded-lg border border-gray-200 dark:border-gray-600"
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white truncate">
                    {selectedFile.name}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {formatFileSize(selectedFile.size)}
                  </p>
                </div>
                <button
                  onClick={clearFile}
                  className="ml-4 p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  aria-label="Remove file"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div
        {...getRootProps()}
        className={`
          relative border-2 border-dashed rounded-xl p-12 transition-all cursor-pointer
          ${isDragActive
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
            : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 bg-gray-50 dark:bg-gray-800/50'
          }
        `}
      >
        <input {...getInputProps()} />

        <div className="flex flex-col items-center justify-center text-center">
          {isDragActive ? (
            <FileImage className="w-16 h-16 text-blue-500 mb-4" />
          ) : (
            <Upload className="w-16 h-16 text-gray-400 mb-4" />
          )}

          <p className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            {isDragActive ? 'Drop your image here' : 'Drag & drop an image here'}
          </p>

          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            or click to browse
          </p>

          <div className="flex flex-wrap gap-2 justify-center text-xs text-gray-500 dark:text-gray-400">
            <span className="px-2 py-1 bg-white dark:bg-gray-700 rounded">PNG</span>
            <span className="px-2 py-1 bg-white dark:bg-gray-700 rounded">JPEG</span>
            <span className="px-2 py-1 bg-white dark:bg-gray-700 rounded">WebP</span>
          </div>

          <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
            Maximum file size: 10MB
          </p>
        </div>
      </div>

      {error && (
        <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}
    </div>
  );
}
