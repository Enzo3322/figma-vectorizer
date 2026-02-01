'use client';

import { useVectorizerStore } from '@/lib/store/vectorizer-store';
import FileDropzone from '@/components/upload/FileDropzone';
import SettingsPanel from '@/components/vectorization/SettingsPanel';
import VectorPreview from '@/components/vectorization/VectorPreview';
import FigmaExportButton from '@/components/figma/FigmaExportButton';
import Button from '@/components/ui/Button';
import { ArrowRight, ArrowLeft, Sparkles } from 'lucide-react';

export default function Home() {
  const {
    currentStep,
    setCurrentStep,
    uploadedFile,
    setUploadedFile,
    vectorizeOptions,
    setVectorizeOptions,
    result,
    setResult,
    isProcessing,
    setIsProcessing,
    error,
    setError,
    reset,
  } = useVectorizerStore();

  const handleVectorize = async () => {
    if (!uploadedFile) return;

    setIsProcessing(true);
    setError(null);

    try {
      // Convert dataUrl to buffer
      const base64Data = uploadedFile.dataUrl.split(',')[1];

      const response = await fetch('/api/vectorize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          buffer: base64Data,
          options: vectorizeOptions,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Vectorization failed');
      }

      setResult(data);
      setCurrentStep('export');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to vectorize image');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleNewImage = () => {
    reset();
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8 md:py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Figma Vectorizer
          </h1>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300">
            Convert raster images to editable vectors in Figma
          </p>
        </div>

        {/* Progress Steps */}
        <div className="max-w-3xl mx-auto mb-8">
          <div className="flex items-center justify-between">
            {(['upload', 'vectorize', 'export'] as const).map((step, index) => (
              <div key={step} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <div
                    className={`
                      w-10 h-10 rounded-full flex items-center justify-center font-semibold mb-2
                      ${
                        currentStep === step
                          ? 'bg-blue-600 text-white'
                          : index < ['upload', 'vectorize', 'export'].indexOf(currentStep)
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-300'
                      }
                    `}
                  >
                    {index + 1}
                  </div>
                  <span
                    className={`text-sm font-medium capitalize ${
                      currentStep === step
                        ? 'text-blue-600 dark:text-blue-400'
                        : 'text-gray-500 dark:text-gray-400'
                    }`}
                  >
                    {step}
                  </span>
                </div>
                {index < 2 && (
                  <div
                    className={`h-1 flex-1 mx-2 rounded ${
                      index < ['upload', 'vectorize', 'export'].indexOf(currentStep)
                        ? 'bg-green-500'
                        : 'bg-gray-300 dark:bg-gray-600'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-5xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 md:p-8">
          {/* Upload Step */}
          {currentStep === 'upload' && (
            <div className="space-y-6">
              <FileDropzone onFileSelect={setUploadedFile} selectedFile={uploadedFile} />

              {uploadedFile && (
                <div className="flex justify-end">
                  <Button
                    onClick={() => setCurrentStep('vectorize')}
                    size="lg"
                    className="min-w-[200px]"
                  >
                    Next: Vectorize
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* Vectorize Step */}
          {currentStep === 'vectorize' && (
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                    Original Image
                  </h2>
                  {uploadedFile && (
                    <img
                      src={uploadedFile.dataUrl}
                      alt="Original"
                      className="w-full rounded-lg border-2 border-gray-200 dark:border-gray-700"
                    />
                  )}
                </div>

                <div>
                  <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                    Vectorization Settings
                  </h2>
                  <SettingsPanel options={vectorizeOptions} onChange={setVectorizeOptions} />
                </div>
              </div>

              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                  <p className="text-red-600 dark:text-red-400">{error}</p>
                </div>
              )}

              <div className="flex gap-3">
                <Button onClick={() => setCurrentStep('upload')} variant="outline" size="lg">
                  <ArrowLeft className="w-5 h-5 mr-2" />
                  Back
                </Button>

                <Button
                  onClick={handleVectorize}
                  isLoading={isProcessing}
                  size="lg"
                  className="flex-1"
                >
                  <Sparkles className="w-5 h-5 mr-2" />
                  {isProcessing ? 'Vectorizing...' : 'Vectorize Image'}
                </Button>
              </div>
            </div>
          )}

          {/* Export Step */}
          {currentStep === 'export' && result && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                  Vectorized Result
                </h2>
                <VectorPreview result={result} />
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                  Export to Figma
                </h2>
                <FigmaExportButton svg={result.svg} filename={uploadedFile?.name.replace(/\.[^.]+$/, '.svg')} />
              </div>

              <div className="flex gap-3">
                <Button onClick={() => setCurrentStep('vectorize')} variant="outline" size="lg">
                  <ArrowLeft className="w-5 h-5 mr-2" />
                  Adjust Settings
                </Button>

                <Button onClick={handleNewImage} variant="secondary" size="lg" className="flex-1">
                  Vectorize Another Image
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-gray-500 dark:text-gray-400">
          <p>Powered by Potrace • Open Source • Free to Use</p>
        </div>
      </div>
    </main>
  );
}
