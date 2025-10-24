import { ColorState } from '../App';
import { HSL, RGB, hslToHex, hslToRgb, interpolateHue, interpolateLinear, getContrastRatio, getWCAGLevel, hexToHSL } from './colorMath';
import { getCubicBezier, getEasingFunction } from './easingCurves';

export interface ColorStep {
  index: number;
  hsl: HSL;
  rgb: RGB;
  hex: string;
  contrastRatioWhite: number;
  contrastRatioBlack: number;
  wcagWhite: 'AAA' | 'AA' | 'A' | 'Fail';
  wcagBlack: 'AAA' | 'AA' | 'A' | 'Fail';
  isPinned?: boolean;
}

export interface PaletteData {
  colors: ColorStep[];
  hueValues: number[];
  saturationValues: number[];
  brightnessValues: number[];
  luminanceValues: number[];
}

const WHITE_RGB: RGB = { r: 255, g: 255, b: 255 };
const BLACK_RGB: RGB = { r: 0, g: 0, b: 0 };

// RGB to Luminance function using WCAG formula
function rgbToLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map(function (v) {
    v /= 255;
    return v <= 0.03928
      ? v / 12.92
      : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return rs * 0.2126 + gs * 0.7152 + bs * 0.0722;
}

// Calculate multi-dimensional color similarity (Euclidean distance in HSL space)
function colorSimilarity(color1: HSL, color2: HSL): number {
  // Circular hue distance (0-180 max)
  const hueDiff = Math.abs(color1.h - color2.h);
  const hueDist = Math.min(hueDiff, 360 - hueDiff);

  const satDist = Math.abs(color1.s - color2.s);
  const lightDist = Math.abs(color1.l - color2.l);

  // Normalize to comparable scales and compute Euclidean distance
  return Math.sqrt(
    Math.pow(hueDist / 180, 2) +
    Math.pow(satDist / 100, 2) +
    Math.pow(lightDist / 100, 2)
  );
}

// Find the best position to insert a pinned color based on similarity
function findInsertPosition(pinnedHSL: HSL, colors: ColorStep[]): number {
  if (colors.length === 0) return 0;
  if (colors.length === 1) {
    // If only one color, decide if pinned should go before or after
    const distToFirst = colorSimilarity(pinnedHSL, colors[0].hsl);
    return distToFirst < 0.5 ? 0 : 1;
  }

  let minScore = Infinity;
  let insertPos = colors.length; // Default: append at end

  // Check each adjacent pair
  for (let i = 0; i < colors.length - 1; i++) {
    const score =
      colorSimilarity(pinnedHSL, colors[i].hsl) +
      colorSimilarity(pinnedHSL, colors[i + 1].hsl);

    if (score < minScore) {
      minScore = score;
      insertPos = i + 1; // Insert between i and i+1
    }
  }

  // Also check if it should go at very start or end
  const startScore = colorSimilarity(pinnedHSL, colors[0].hsl) * 2;
  const endScore = colorSimilarity(pinnedHSL, colors[colors.length - 1].hsl) * 2;

  if (startScore < minScore) insertPos = 0;
  if (endScore < minScore) insertPos = colors.length;

  return insertPos;
}

export function generatePalette(colorState: ColorState): PaletteData {
  const { steps, hue, saturation, brightness, pinnedColor, pinnedIndex } = colorState;
  const colors: ColorStep[] = [];
  const hueValues: number[] = [];
  const saturationValues: number[] = [];
  const brightnessValues: number[] = [];
  const luminanceValues: number[] = [];

  // Get easing functions - prefer custom cubic-bezier when provided
  const hueEasing = (hue as any).custom
    ? getCubicBezier((hue as any).custom.x1, (hue as any).custom.y1, (hue as any).custom.x2, (hue as any).custom.y2)
    : getEasingFunction(hue.curve);

  const saturationEasing = (saturation as any).custom
    ? getCubicBezier((saturation as any).custom.x1, (saturation as any).custom.y1, (saturation as any).custom.x2, (saturation as any).custom.y2)
    : getEasingFunction(saturation.curve);

  const brightnessEasing = (brightness as any).custom
    ? getCubicBezier((brightness as any).custom.x1, (brightness as any).custom.y1, (brightness as any).custom.x2, (brightness as any).custom.y2)
    : getEasingFunction(brightness.curve);

  // Always generate full number of steps to maintain natural interpolation
  for (let i = 0; i < steps; i++) {
    // Calculate progress (0 to 1)
    const progress = steps === 1 ? 0 : i / (steps - 1);
    
    // Apply easing to get curved progress values
    const hueProgress = hueEasing(progress);
    const satProgress = saturationEasing(progress);
    const briProgress = brightnessEasing(progress);

    // Interpolate values
    const h = interpolateHue(hue.start, hue.end, hueProgress, hue.longPath);
    const s = interpolateLinear(saturation.start, saturation.end, satProgress) * saturation.rate;
    const l = interpolateLinear(brightness.start, brightness.end, briProgress);

    // Clamp values to valid ranges
    const clampedS = Math.max(0, Math.min(100, s));
    const clampedL = Math.max(0, Math.min(100, l));

    const hslColor: HSL = { h, s: clampedS, l: clampedL };
    const rgbColor = hslToRgb(hslColor);
    const hexColor = hslToHex(hslColor);

    // Calculate luminance using WCAG formula
    const luminance = rgbToLuminance(rgbColor.r, rgbColor.g, rgbColor.b);

    // Calculate contrast ratios and WCAG compliance
    const contrastRatioWhite = getContrastRatio(rgbColor, WHITE_RGB);
    const contrastRatioBlack = getContrastRatio(rgbColor, BLACK_RGB);
    const wcagWhite = getWCAGLevel(contrastRatioWhite);
    const wcagBlack = getWCAGLevel(contrastRatioBlack);

    const colorStep: ColorStep = {
      index: i,
      hsl: hslColor,
      rgb: rgbColor,
      hex: hexColor,
      contrastRatioWhite,
      contrastRatioBlack,
      wcagWhite,
      wcagBlack,
    };

    colors.push(colorStep);
    hueValues.push(h);
    saturationValues.push(clampedS);
    brightnessValues.push(clampedL);
    luminanceValues.push(luminance * 100); // Convert to percentage for easier display
  }

  // Handle pinned color replacement (not insertion)
  // This maintains natural interpolation by replacing a generated color instead of squeezing in
  if (pinnedColor) {
    const pinnedHSL = hexToHSL(pinnedColor);
    if (pinnedHSL) {
      const pinnedRGB = hslToRgb(pinnedHSL);
      const pinnedLuminance = rgbToLuminance(pinnedRGB.r, pinnedRGB.g, pinnedRGB.b);

      // Use provided index if available, otherwise find best position to replace
      const replacePos = pinnedIndex !== undefined
        ? Math.max(0, Math.min(pinnedIndex, colors.length - 1))
        : findInsertPosition(pinnedHSL, colors);

      // Create pinned color step
      const pinnedStep: ColorStep = {
        index: replacePos,
        hsl: pinnedHSL,
        rgb: pinnedRGB,
        hex: pinnedColor.toLowerCase(),
        contrastRatioWhite: getContrastRatio(pinnedRGB, WHITE_RGB),
        contrastRatioBlack: getContrastRatio(pinnedRGB, BLACK_RGB),
        wcagWhite: getWCAGLevel(getContrastRatio(pinnedRGB, WHITE_RGB)),
        wcagBlack: getWCAGLevel(getContrastRatio(pinnedRGB, BLACK_RGB)),
        isPinned: true,
      };

      // Replace the color at that position (the "ghost" color is what was there)
      colors[replacePos] = pinnedStep;
      hueValues[replacePos] = pinnedHSL.h;
      saturationValues[replacePos] = pinnedHSL.s;
      brightnessValues[replacePos] = pinnedHSL.l;
      luminanceValues[replacePos] = pinnedLuminance * 100;
    }
  }

  return {
    colors,
    hueValues,
    saturationValues,
    brightnessValues,
    luminanceValues,
  };
}

export function exportAsCSS(palette: PaletteData): string {
  const cssVars = palette.colors.map((color, index) => 
    `  --color-${index}: ${color.hex};`
  ).join('\n');
  
  return `:root {\n${cssVars}\n}`;
}

export function exportAsJSON(palette: PaletteData, colorState: ColorState): string {
  return JSON.stringify({
    settings: colorState,
    colors: palette.colors.map(color => ({
      index: color.index,
      hex: color.hex,
      hsl: color.hsl,
      rgb: color.rgb,
      accessibility: {
        contrastRatioWhite: color.contrastRatioWhite,
        contrastRatioBlack: color.contrastRatioBlack,
        wcagWhite: color.wcagWhite,
        wcagBlack: color.wcagBlack,
      }
    }))
  }, null, 2);
}

export interface PlainTextExportOptions {
  numbered?: boolean;
  includeHash?: boolean;
}

export function exportAsPlainText(palette: PaletteData, options: PlainTextExportOptions = {}): string {
  const { numbered = true, includeHash = true } = options;

  return palette.colors
    .map((color, index) => {
      const label = numbered ? `${index + 1}. ` : "";
      const hex = includeHash ? color.hex : color.hex.replace(/^#/, "");
      return `${label}${hex}`;
    })
    .join('\n');
}

export function copyToClipboard(text: string): Promise<void> {
  return navigator.clipboard.writeText(text);
}

// Build an SVG string suitable for pasting into Figma. Produces a single row
// of rounded rectangles sized 40x40 with 8px spacing and 8px corner radius.
export function exportAsSVG(palette: PaletteData): string {
  const swatchSize = 40;
  const gap = 8;
  const count = palette.colors.length;
  const width = count > 0 ? count * swatchSize + (count - 1) * gap : swatchSize;
  const height = swatchSize;

  // Timestamp id: YYYYMMDD-HHMMSS in local time
  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  const id = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}-${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;

  const rects = palette.colors.map((c, i) => {
    const x = i * (swatchSize + gap);
    const hex = c.hex.replace('#', '').toUpperCase();
    return `<rect x="${x}" width="${swatchSize}" height="${swatchSize}" fill="#${hex}" id="${hex}"/>`;
  }).join('\n');

  return `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none" xmlns="http://www.w3.org/2000/svg" id="${id}">
${rects}
</svg>`;
}
