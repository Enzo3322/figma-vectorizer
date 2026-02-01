import { create } from 'zustand';
import { UploadedFile, VectorizeOptions, VectorizationResult } from '@/types/vectorization';

export type WizardStep = 'upload' | 'vectorize' | 'export';

interface VectorizerState {
  // Wizard step
  currentStep: WizardStep;
  setCurrentStep: (step: WizardStep) => void;

  // Uploaded file
  uploadedFile: UploadedFile | null;
  setUploadedFile: (file: UploadedFile | null) => void;

  // Vectorization options
  vectorizeOptions: VectorizeOptions;
  setVectorizeOptions: (options: Partial<VectorizeOptions>) => void;

  // Vectorization result
  result: VectorizationResult | null;
  setResult: (result: VectorizationResult | null) => void;

  // Processing state
  isProcessing: boolean;
  setIsProcessing: (isProcessing: boolean) => void;

  // Error state
  error: string | null;
  setError: (error: string | null) => void;

  // Reset all state
  reset: () => void;
}

const defaultOptions: VectorizeOptions = {
  colorMode: 'bw',
  detailLevel: 70,
  smoothness: 50,
  threshold: 128,
  maxColors: 16,
};

export const useVectorizerStore = create<VectorizerState>((set) => ({
  // Initial state
  currentStep: 'upload',
  uploadedFile: null,
  vectorizeOptions: defaultOptions,
  result: null,
  isProcessing: false,
  error: null,

  // Actions
  setCurrentStep: (step) => set({ currentStep: step }),
  setUploadedFile: (file) => set({ uploadedFile: file, error: null }),
  setVectorizeOptions: (options) =>
    set((state) => ({
      vectorizeOptions: { ...state.vectorizeOptions, ...options },
    })),
  setResult: (result) => set({ result }),
  setIsProcessing: (isProcessing) => set({ isProcessing }),
  setError: (error) => set({ error, isProcessing: false }),

  reset: () =>
    set({
      currentStep: 'upload',
      uploadedFile: null,
      vectorizeOptions: defaultOptions,
      result: null,
      isProcessing: false,
      error: null,
    }),
}));
