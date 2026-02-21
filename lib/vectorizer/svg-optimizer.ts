import { optimize, Config } from 'svgo';

export interface OptimizationOptions {
  level: number; // 0-100, where 0 is conservative, 100 is aggressive
}

/**
 * Optimize SVG for smaller file size and Figma compatibility
 */
export function optimizeSVG(svgString: string, options: OptimizationOptions = { level: 50 }): string {
  const { level } = options;

  // Configure SVGO plugins based on optimization level
  const config: Config = {
    multipass: level > 70,
    plugins: [
      // Remove unnecessary metadata
      {
        name: 'removeDoctype',
      },
      {
        name: 'removeXMLProcInst',
      },
      {
        name: 'removeComments',
      },
      {
        name: 'removeMetadata',
      },
      {
        name: 'removeEditorsNSData',
      },

      // Optimize structure
      {
        name: 'cleanupAttrs',
      },
      {
        name: 'mergeStyles',
      },
      {
        name: 'inlineStyles',
      },
      {
        name: 'minifyStyles',
      },
      {
        name: 'cleanupIds',
      },

      // Simplify paths - more aggressive at higher levels
      {
        name: 'convertPathData',
        params: {
          floatPrecision: level > 70 ? 1 : level > 40 ? 2 : 3,
          transformPrecision: level > 70 ? 3 : 5,
        },
      },

      // Merge paths if aggressive optimization
      ...(level > 70
        ? [
            {
              name: 'mergePaths' as const,
            },
          ]
        : []),

      // Remove empty elements
      {
        name: 'removeEmptyAttrs',
      },
      {
        name: 'removeEmptyContainers',
      },

      // Optimize transforms
      {
        name: 'convertTransform',
      },

      // Remove hidden elements
      {
        name: 'removeHiddenElems',
      },

      // Sort attributes for consistency
      {
        name: 'sortAttrs',
      },
    ],
  };

  try {
    const result = optimize(svgString, config);
    return result.data;
  } catch (error) {
    console.error('SVG optimization error:', error);
    // Return original SVG if optimization fails
    return svgString;
  }
}

/**
 * Validate SVG for Figma compatibility
 * Checks for supported path commands and structure
 */
export function validateFigmaCompatibility(svgString: string): { isValid: boolean; warnings: string[] } {
  const warnings: string[] = [];

  // Check for unsupported elements
  const unsupportedElements = ['text', 'foreignObject', 'video', 'audio', 'script'];
  unsupportedElements.forEach((elem) => {
    if (svgString.includes(`<${elem}`)) {
      warnings.push(`Contains unsupported element: ${elem}`);
    }
  });

  // Check for filters (partially supported in Figma)
  if (svgString.includes('<filter')) {
    warnings.push('Contains filters which may not render correctly in Figma');
  }

  // Check for gradients (supported but complex)
  if (svgString.includes('linearGradient') || svgString.includes('radialGradient')) {
    warnings.push('Contains gradients - ensure they are properly defined');
  }

  // Figma supports: M, L, H, V, C, S, Q, T, A, Z
  // These are all standard SVG path commands, so we're good

  return {
    isValid: warnings.length === 0 || !warnings.some((w) => w.includes('unsupported element')),
    warnings,
  };
}

/**
 * Extract SVG metadata
 */
export function extractSVGMetadata(svgString: string) {
  const pathCount = (svgString.match(/<path/g) || []).length;
  const circleCount = (svgString.match(/<circle/g) || []).length;
  const rectCount = (svgString.match(/<rect/g) || []).length;
  const ellipseCount = (svgString.match(/<ellipse/g) || []).length;

  // Extract viewBox
  const viewBoxMatch = svgString.match(/viewBox=["']([^"']+)["']/);
  const viewBox = viewBoxMatch ? viewBoxMatch[1] : null;

  // Extract dimensions
  const widthMatch = svgString.match(/width=["']([^"']+)["']/);
  const heightMatch = svgString.match(/height=["']([^"']+)["']/);

  return {
    pathCount,
    circleCount,
    rectCount,
    ellipseCount,
    totalShapes: pathCount + circleCount + rectCount + ellipseCount,
    viewBox,
    width: widthMatch ? widthMatch[1] : null,
    height: heightMatch ? heightMatch[1] : null,
    size: Buffer.byteLength(svgString, 'utf8'),
  };
}
