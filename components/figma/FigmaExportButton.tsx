'use client';

import { useState } from 'react';
import { Download, Copy, Check, ExternalLink } from 'lucide-react';
import Button from '@/components/ui/Button';

interface FigmaExportButtonProps {
  svg: string;
  filename?: string;
}

export default function FigmaExportButton({ svg, filename = 'vector.svg' }: FigmaExportButtonProps) {
  const [copied, setCopied] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(svg);
      setCopied(true);
      setShowInstructions(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const downloadSVG = () => {
    const blob = new Blob([svg], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-3">
        <Button onClick={copyToClipboard} className="flex-1" size="lg">
          {copied ? (
            <>
              <Check className="w-5 h-5 mr-2" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="w-5 h-5 mr-2" />
              Copy SVG
            </>
          )}
        </Button>

        <Button onClick={downloadSVG} variant="secondary" size="lg">
          <Download className="w-5 h-5 mr-2" />
          Download
        </Button>
      </div>

      {showInstructions && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
          <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-3 flex items-center">
            <ExternalLink className="w-5 h-5 mr-2" />
            Next Steps: Import to Figma
          </h3>

          <div className="space-y-3 text-sm text-blue-800 dark:text-blue-200">
            <div className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">
                1
              </span>
              <p>Open Figma and navigate to the file where you want to add the vector</p>
            </div>

            <div className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">
                2
              </span>
              <p>
                Install the <strong>Figma Vectorizer Plugin</strong> from the Figma Community or
                use any SVG import plugin
              </p>
            </div>

            <div className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">
                3
              </span>
              <p>Run the plugin and paste the SVG code (already copied to your clipboard!)</p>
            </div>

            <div className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">
                4
              </span>
              <p>The vector will be created on your Figma canvas and ready to edit!</p>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-blue-200 dark:border-blue-800">
            <p className="text-xs text-blue-700 dark:text-blue-300">
              <strong>Alternative:</strong> You can also download the SVG file and drag it directly
              into Figma, though using a plugin gives you more control over the import.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
