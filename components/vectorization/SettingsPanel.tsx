'use client';

import { ColorMode, VectorizeOptions } from '@/types/vectorization';

interface SettingsPanelProps {
  options: VectorizeOptions;
  onChange: (options: Partial<VectorizeOptions>) => void;
}

export default function SettingsPanel({ options, onChange }: SettingsPanelProps) {
  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Color Mode
        </label>
        <div className="grid grid-cols-3 gap-3">
          {(['bw', 'grayscale', 'color'] as ColorMode[]).map((mode) => (
            <button
              key={mode}
              onClick={() => onChange({ colorMode: mode })}
              className={`
                px-4 py-3 rounded-lg border-2 transition-all
                ${
                  options.colorMode === mode
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }
              `}
            >
              <div className="text-sm font-medium capitalize">{mode === 'bw' ? 'B&W' : mode}</div>
            </button>
          ))}
        </div>
      </div>

      {options.colorMode === 'bw' && (
        <div>
          <label
            htmlFor="threshold"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Threshold: {options.threshold}
          </label>
          <input
            id="threshold"
            type="range"
            min="0"
            max="255"
            value={options.threshold}
            onChange={(e) => onChange({ threshold: parseInt(e.target.value) })}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
          />
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
            <span>More black</span>
            <span>More white</span>
          </div>
        </div>
      )}

      <div>
        <label
          htmlFor="detail"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
        >
          Detail Level: {options.detailLevel}
        </label>
        <input
          id="detail"
          type="range"
          min="0"
          max="100"
          value={options.detailLevel}
          onChange={(e) => onChange({ detailLevel: parseInt(e.target.value) })}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
        />
        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
          <span>Simple</span>
          <span>Detailed</span>
        </div>
      </div>

      <div>
        <label
          htmlFor="smoothness"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
        >
          Smoothness: {options.smoothness}
        </label>
        <input
          id="smoothness"
          type="range"
          min="0"
          max="100"
          value={options.smoothness}
          onChange={(e) => onChange({ smoothness: parseInt(e.target.value) })}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
        />
        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
          <span>Sharp</span>
          <span>Smooth</span>
        </div>
      </div>

      {options.colorMode === 'color' && (
        <div>
          <label
            htmlFor="maxColors"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Max Colors: {options.maxColors}
          </label>
          <input
            id="maxColors"
            type="range"
            min="2"
            max="32"
            value={options.maxColors}
            onChange={(e) => onChange({ maxColors: parseInt(e.target.value) })}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
          />
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
            <span>2</span>
            <span>32</span>
          </div>
        </div>
      )}

      <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
          <p>
            <strong>Detail Level:</strong> Higher values preserve more details but create larger
            files
          </p>
          <p>
            <strong>Smoothness:</strong> Higher values create smoother curves but may lose sharp
            edges
          </p>
        </div>
      </div>
    </div>
  );
}
